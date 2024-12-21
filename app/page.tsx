"use client"

import { useEffect, useState } from 'react';
import Todo from '../Components/Todo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { TodoItem } from '../lib/types';


export default function Home() {

  const [formData, SetFormData] = useState({
    title: "",
    description: "",
  })

  const [todoData, setTodoData] = useState<TodoItem[]>([]);


  const fetchTodos = async () => {
    const response = await axios('/api');
    setTodoData(response.data.todos)
  }

  const deleteTodo = async (id: string) => {

    const response = await axios.delete('/api', {
      params: {
        mongoId: id
      }
    })
    toast.success(response.data.msg);
    fetchTodos();
  }

  const completeTodo = async (id: string) => {

    const response = await axios.put('/api', {}, {
      params: {
        mongoId: id
      }
    })
    toast.success(response.data.msg);
    fetchTodos();
  }

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('/api/todos'); // Ensure this is the correct route
        setTodoData(response.data); // Ensure data is coming back and is set to state
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []); // Ensure fetch is called only on mount




  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; // Destructure the name and value from the target
    SetFormData((form) => ({
      ...form,
      [name]: value, // Dynamically update form state based on the name of the input
    }));
    console.log(formData); // Check if formData is updating correctly
  };


  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Post formData to your API
      const response = await axios.post('/api', formData);

      // Show success toast message
      toast.success(response.data.msg);

      // Reset the form fields after successful submission
      SetFormData({
        title: "",
        description: "",
      });

      // Fetch the updated todos or data
      await fetchTodos();

    } catch {
      // Show error toast message
      toast.error("Unsuccessful!");
    }
  };

  return (
    <>
      <ToastContainer theme="light" />
      <form onSubmit={onSubmitHandler} className="flex items-start flex-col gap-3 w-[80%] max-w-[600px] mt-24 px-2 mx-auto">
        <input value={formData.title} onChange={onChangeHandler} type="text" name="title" placeholder="Enter Title" className="px-3 py-2 border-2 w-full" />
        <textarea value={formData.description} onChange={onChangeHandler} name="description" placeholder="Enter Description" className="px-2 py-2 border-2 w-full"></textarea>
        <button type="submit" className="bg-blue-500 py-3 px-11 text-white rounded ml-auto">Add Todo</button>
      </form>



      <div className="relative overflow-x-auto mt-24 w-[60%] mx-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-white text-black">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {todoData.map((item, index) => (
              <Todo
                key={index}
                id={index}
                title={item.title} // No more type error
                description={item.description}
                complete={item.isCompleted}
                mongoId={item._id}
                deleteTodo={deleteTodo}
                completeTodo={completeTodo}
              />
            ))}
          </tbody>

        </table>
      </div>


    </>
  );
}
