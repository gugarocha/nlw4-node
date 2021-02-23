import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "../models/User";

class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const usersRepository = getRepository(User);

    const userAlredyExists = await usersRepository.findOne({ email });

    if (userAlredyExists) {
      return res.status(400).json({
        error: 'User alredy exists!'
      })
    }

    const user = usersRepository.create({
      name,
      email
    });

    await usersRepository.save(user);

    return res.status(201).json(user);
  }
};

export { UserController };