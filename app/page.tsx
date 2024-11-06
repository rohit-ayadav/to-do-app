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
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Types
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

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  getPriorityColor: (priority: string) => string;
}

// TodoItem Component
const TodoItem = ({ todo, onToggle, onDelete, onEdit, onRemoveTag, getPriorityColor }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSaveEdit = () => {
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2 flex-1">
            <button
              onClick={() => onToggle(todo.id)}
              className={`mt-1 ${todo.completed ? 'text-green-500' : 'text-gray-400'}`}
              aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {todo.completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>

            {isEditing ? (
              <div className="flex gap-2 flex-1">
                <Input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveEdit}>Save</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex-1">
                <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.text}
                </span>
                {todo.notes && (
                  <span className="block text-sm text-gray-500 mt-1">
                    {todo.notes}
                  </span>
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
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-blue-500"
                  aria-label="Edit todo"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="text-gray-500 hover:text-red-500"
                  aria-label="Delete todo"
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
            <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {todo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {todo.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center">
                <Badge
                  variant="secondary"
                  className="px-2 py-1"
                >
                  {tag}
                  <button
                    onClick={() => onRemoveTag(todo.id, tag)}
                    className="ml-2"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

// Main TodoApp Component
const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos);
          toast.success('Todos loaded successfully');
        }
      } catch (error) {
        console.error('Error loading todos:', error);
        toast.error('Failed to load todos');
      }
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      try {
        localStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.error('Error saving todos:', error);
        toast.error('Failed to save todos');
      }
    }
  }, [todos]);

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      setNewTag('');
    } else {
      toast.error('Please enter a valid tag');
    }
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) {
      toast.error('Please enter a todo item');
      return;
    }

    try {
      const newTodoItem: Todo = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: newTodo.trim(),
        completed: false,
        priority: selectedPriority,
        tags: [...selectedTags],
        dueDate: dueDate || undefined,
        notes: notes?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      setTodos(prevTodos => [...prevTodos, newTodoItem]);
      resetForm();
      toast.success('Todo added successfully');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add todo');
    }
  };

  const resetForm = () => {
    setNewTodo('');
    setSelectedTags([]);
    setDueDate('');
    setNotes('');
    setSelectedPriority('medium');
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-500';
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

  if (!isClient) {
    return null; // Prevent hydration errors by not rendering until client-side
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
            <span className="text-gray-600">
              A simple todo app built with Next.js and Tailwind CSS
            </span>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Todo List</CardTitle>
              <div className="flex gap-4">
                <Badge variant="outline">Total: {stats.total}</Badge>
                <Badge variant="outline" className="bg-green-50">
                  Completed: {stats.completed}
                </Badge>
                <Badge variant="outline" className="bg-blue-50">
                  Active: {stats.active}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
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
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                    >
                      Add Tag
                    </Button>
                  </div>
                </div>

                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span key={tag} className="inline-flex items-center">
                        <Badge
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
                      </span>
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
                />
              </div>

              {filteredAndSortedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={(id) =>
                    setTodos((prevTodos) =>
                      prevTodos.map((t) =>
                        t.id === id ? { ...t, completed: !t.completed } : t
                      )
                    )
                  }
                  onDelete={(id) =>
                    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id))
                  }
                  onEdit={(id, newText) =>
                    setTodos((prevTodos) =>
                      prevTodos.map((t) =>
                        t.id === id ? { ...t, text: newText } : t
                      )
                    )
                  }
                  onRemoveTag={(id, tag) =>
                    setTodos((prevTodos) =>
                      prevTodos.map((t) =>
                        t.id === id ? { ...t, tags: t.tags.filter((t) => t !== tag) } : t
                      )
                    )
                  }
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default TodoApp;