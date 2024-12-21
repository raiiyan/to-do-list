import { NextApiRequest, NextApiResponse } from 'next';
import {ConnectDB} from '../../lib/config/db';
import TodoModel from '../../lib/models/TodoModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await ConnectDB();

  try {
    const todos = await TodoModel.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
}
