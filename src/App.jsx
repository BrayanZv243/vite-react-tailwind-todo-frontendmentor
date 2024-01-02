import { DragDropContext } from "@hello-pangea/dnd";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import TodoCreate from "./components/TodoCreate";
import TodoList from "./components/TodoList";
import TodoComputed from "./components/TodoComputed";
import TodoFilter from "./components/TodoFilter";

const initialStateTodos = JSON.parse(localStorage.getItem("todos")) || [];

const reOrder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const App = () => {
    const [todos, setTodos] = useState(initialStateTodos);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const createTodo = (title) => {
        const newTodo = {
            id: Date.now(),
            title,
            completed: false,
        };

        setTodos([...todos, newTodo]);
    };

    const removeTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const updateTodo = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo,
            ),
        );
    };

    const computedItemsLeft = todos.filter((todo) => !todo.completed).length;

    const clearCompleted = () => {
        setTodos(todos.filter((todo) => !todo.completed));
    };

    const filteredTodos = () => {
        switch (filter) {
            case "all":
                return todos;
            case "active":
                return todos.filter((todo) => !todo.completed);
            case "completed":
                return todos.filter((todo) => todo.completed);
            default:
                return todos;
        }
    };

    const changeFilter = (filter) => setFilter(filter);

    const handleDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        if (
            source.index === destination.index &&
            source.droppableId === destination.droppableId
        )
            return;

        setTodos((prevTasks) =>
            reOrder(prevTasks, source.index, destination.index),
        );
    };

    return (
        <>
            <div
                className="min-h-screen bg-gray-300 bg-[url('./assets/images/bg-mobile-light.jpg')] 
            bg-contain bg-no-repeat transition-all
            duration-1000 md:bg-[url('./assets/images/bg-desktop-light.jpg')] dark:bg-gray-900
            dark:bg-[url('./assets/images/bg-mobile-dark.jpg')] md:dark:bg-[url('./assets/images/bg-desktop-dark.jpg')]"
            >
                <Header />

                <main className="container mx-auto mt-8 px-4 md:max-w-xl">
                    <TodoCreate createTodo={createTodo} />
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <TodoList
                            todos={filteredTodos()}
                            removeTodo={removeTodo}
                            updateTodo={updateTodo}
                        />
                    </DragDropContext>

                    <TodoComputed
                        computedItemsLeft={computedItemsLeft}
                        clearCompleted={clearCompleted}
                    />
                    <TodoFilter changeFilter={changeFilter} filter={filter} />
                </main>

                <footer className="mt-8 text-center transition-all duration-1000 dark:text-gray-400">
                    Drag and Drop to reorder list
                </footer>
            </div>
        </>
    );
};

export default App;
