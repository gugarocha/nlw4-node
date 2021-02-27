import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';

import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import sendMailService from "../services/sendMailService";

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: 'User does not exist'
      });
    };

    const survey = await surveysRepository.findOne({
      id: survey_id
    });

    if (!survey) {
      return res.status(400).json({
        error: 'Survey does not exist'
      });
    };

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
    const variables = {
      name: user.name,
      user_id: user.id,
      title: survey.title,
      description: survey.description,
      link: process.env.URL_MAIL
    }

    const surveyUserAlredyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id, value: null }],
      relations: ['user', 'survey']
    });

    if (surveyUserAlredyExists) {
      await sendMailService.execute(email, survey.title, variables, npsPath);
      return res.json(surveyUserAlredyExists);
    };

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    });
    await surveysUsersRepository.save(surveyUser);


    await sendMailService.execute(email, survey.title, variables, npsPath);

    return res.json(surveyUser);
  }
};

export { SendMailController };
