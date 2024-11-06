# Advanced Todo App

A feature-rich todo application built with Next.js 14, React, TypeScript, and Tailwind CSS, featuring a modern UI powered by shadcn/ui components.

## Features

✨ **Core Functionality**
- Create, edit, and delete todos
- Mark todos as complete/incomplete
- Rich text input with support for notes
- Local storage persistence

🏷️ **Organization**
- Add multiple tags to todos
- Set priority levels (Low, Medium, High)
- Add due dates
- Include detailed notes

🔍 **Filtering & Sorting**
- Filter by status (All, Active, Completed)
- Sort by creation date, due date, or priority
- Search functionality
- Tag-based filtering

💅 **UI/UX**
- Clean, modern interface
- Responsive design
- Real-time updates
- Toast notifications
- Color-coded priorities
- Progress statistics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide Icons
- **State Management**: React Hooks
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install required shadcn/ui components:
```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add select
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating a Todo
1. Enter your todo text in the main input field
2. (Optional) Set a priority level
3. (Optional) Add a due date
4. (Optional) Add tags
5. (Optional) Add notes
6. Click the "Add" button or press Enter

### Managing Todos
- Click the checkbox to toggle completion status
- Click the edit icon to modify todo text
- Click the trash icon to delete a todo
- Click the 'x' on tags to remove them

### Filtering and Sorting
- Use the tabs to filter by status
- Use the sort dropdown to change the order
- Use the search bar to find specific todos
- Click on tags to filter by tag

## Project Structure

```
src/
├── app/
│   └── page.tsx        # Main todo app page
├── components/
│   ├── ui/            # shadcn/ui components
│   └── TodoItem.tsx   # Todo item component
└── types/
    └── index.ts       # TypeScript interfaces
```

## Local Storage

The app automatically saves todos to local storage, persisting them between page reloads. The storage key used is 'todos'.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide Icons](https://lucide.dev/) for the icon set
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling system

## Support

For support, please open an issue in the repository or contact [rohitkuyada@gmail.com] or @rohit-ayadav.