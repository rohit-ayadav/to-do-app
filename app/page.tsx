"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Circle, Edit, Calendar, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast, { Toaster } from 'react-hot-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes?: string;
  createdAt: string;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt');


  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        console.log('Parsed todos:', parsedTodos);
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos);
          toast.success('Todos Found');
        } else {
          throw new Error('Stored todos is not an array');
        }
      } else {
        console.log('No todos found in localStorage');
      }
    } catch (error) {
      console.error('Error loading todos:', error);
      toast.error('Failed to load todos');
    }
  }, []);


  useEffect(() => {
    console.log('Todos state after update:', todos);
  }, [todos]);


  useEffect(() => {
    try {
      if (todos.length > 0) {
        localStorage.setItem('todos', JSON.stringify(todos));
        console.log('Todos saved:', todos);
      }
    } catch (error) {
      console.error('Error saving todos:', error);
      toast.error('Failed to save todos');
    }
  }, [todos]);


  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) {
      toast.error('Please enter a todo item');
      return;
    }

    try {
      const newTodoItem: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        priority: selectedPriority,
        tags: [...selectedTags],
        dueDate: dueDate || undefined,
        notes: notes?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      setTodos(prevTodos => [...prevTodos, newTodoItem]);

      setNewTodo('');
      setSelectedTags([]);
      setDueDate('');
      setNotes('');
      setSelectedPriority('medium');

      toast.success('Todo added successfully');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add todo');
    }
  };


  const toggleTodo = (id: string) => {
    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('Failed to update todo');
    }
  };


  const deleteTodo = (id: string) => {
    try {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      toast.success('Todo deleted');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  };


  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };


  const saveEdit = (id: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
  };


  const addTag = (todoId: string, tag: string) => {
    if (tag.trim()) {
      setTodos(todos.map((todo) =>
        todo.id === todoId && !todo.tags.includes(tag)
          ? { ...todo, tags: [...todo.tags, tag] }
          : todo
      ));
    }
  };


  const removeTag = (todoId: string, tagToRemove: string) => {
    setTodos(todos.map((todo) =>
      todo.id === todoId
        ? { ...todo, tags: todo.tags.filter((tag) => tag !== tagToRemove) }
        : todo
    ));
  };


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };


  const filteredAndSortedTodos = todos
    .filter((todo) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);

      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return (a.dueDate || '') > (b.dueDate || '') ? 1 : -1;
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        default:
          return a.createdAt > b.createdAt ? -1 : 1;
      }
    });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
  };


  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <header className="text-center text-2xl font-semibold mt-4">
        <h1>Todo App</h1>
      </header>
      <div className="text-center text-gray-500 text-sm mt-2">
        <p>
          A simple todo app built with Next.js and Tailwind CSS
        </p>
      </div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
          <CardDescription className="flex gap-4">
            <Badge variant="outline">Total: {stats.total}</Badge>
            <Badge variant="outline" className="bg-green-50">
              Completed: {stats.completed}
            </Badge>
            <Badge variant="outline" className="bg-blue-50">
              Active: {stats.active}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={addTodo} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1"
              />
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={selectedPriority}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setSelectedPriority(value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-40"
              />

              <div className="flex gap-2 flex-1">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tags..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newTag.trim() && !selectedTags.includes(newTag)) {
                        setSelectedTags([...selectedTags, newTag]);
                        setNewTag('');
                      }
                      else {
                        toast.error('Please enter a valid tag');
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newTag.trim() && !selectedTags.includes(newTag)) {
                      setSelectedTags([...selectedTags, newTag]);
                      setNewTag('');
                    }
                    else {
                      toast.error('Please enter a valid tag');
                    }
                  }}
                >
                  Add Tag
                </Button>
              </div>
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 py-1"
                  >
                    {tag}
                    <button
                      onClick={() =>
                        setSelectedTags(selectedTags.filter((t) => t !== tag))
                      }
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
            />
          </form>

          <h2 className="text-lg font-semibold">Your Todos</h2>

          <div className="flex flex-wrap gap-4 items-center">
            <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search todos..."
              className="flex-1"
            />
          </div>

          <div className="space-y-2">
            {filteredAndSortedTodos.map((todo) => (
              <Card key={todo.id} className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2 flex-1">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`mt-1 ${todo.completed ? 'text-green-500' : 'text-gray-400'
                          }`}
                      >
                        {todo.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      {editingId === todo.id ? (
                        <div className="flex gap-2 flex-1">
                          <Input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={() => saveEdit(todo.id)}>Save</Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <p
                            className={`${todo.completed ? 'line-through text-gray-500' : ''
                              }`}
                          >
                            {todo.text}
                          </p>
                          {todo.notes && (
                            <p className="text-sm text-gray-500 mt-1">
                              {todo.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getPriorityColor(todo.priority)}
                      >
                        {todo.priority}
                      </Badge>
                      {!editingId && (
                        <>
                          <button
                            onClick={() => startEditing(todo)}
                            className="text-gray-500 hover:text-blue-500"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {todo.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </div>
                  )}

                  {todo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {todo.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="px-2 py-1"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(todo.id, tag)}
                            className="ml-2"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredAndSortedTodos.length === 0 && (
            <Alert>
              <AlertDescription>
                No todos found. {filter !== 'all' && 'Try changing the filter.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <footer className="text-center text-gray-500 text-sm mt-4">
        <p>
          Built with <a href="https://nextjs.org" className="underline">Next.js</a> and <a href="https://tailwindcss.com" className="underline">Tailwind CSS</a> by <a href="https://www.linkedin.com/in/rohitkumaryadav-rky/" className="underline">Rohit Kumar Yadav</a>
        </p>
        <p>
          <a href="" className="underline">View source code</a> on GitHub
        </p>
      </footer>

    </>
  );
};

export default TodoApp;