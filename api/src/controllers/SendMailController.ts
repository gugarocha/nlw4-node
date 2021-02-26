import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userAlredyExists = await usersRepository.findOne({ email });

    if (!userAlredyExists) {
      return res.status(400).json({
        error: 'User does not exist'
      });
    };

    const surveyAlredyExists = await surveysRepository.findOne({
      id: survey_id
    });

    if (!surveyAlredyExists) {
      return res.status(400).json({
        error: 'Survey does not exist'
      });
    };

    const surveyUser = surveysUsersRepository.create({
      user_id: userAlredyExists.id,
      survey_id
    });
    await surveysUsersRepository.save(surveyUser);

    return res.json(surveyUser);    
  }
};

export { SendMailController };
