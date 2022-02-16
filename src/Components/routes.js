import Login from "./Login";
import Chat from "./Chat";
import Search from "./Search";
import About from "./About/About";




export const publicRoutes = [
    {
        path: '/chat/:id',
        Component: Chat
    },
    {
        path: '/search',
        Component: Search
    },
    {
        path: '/login',
        Component: Login
    },
    {
        path: '/about',
        Component: About
    }

]

export const privateRoutes = [
    {
        path: '/chat/:id',
        Component: Chat
    },
    {
        path: '/search',
        Component: Search
    },
    {
        path: '/about',
        Component: About
    }
    
]