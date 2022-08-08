import Login from "./Login";
import Chat from "./Chat";
import Search from "./Search";
import About from "./About/About";
import Me from "./Me";
import User from "./User";
import MyChats from "./MyChats";
import Settings from "./Settings";




export const publicRoutes = [
    {
        path: '/login',
        Component: Login
    },
    {
        path: '/about',
        Component: About
    },
]

export const privateRoutes = [
    {
        path: '/chat',
        Component: Chat
    },
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
    },
    {
        path: '/me',
        Component: Me
    },
    {
        path: '/user/:id',
        Component: User
    },
    {
        path: '/settings',
        Component: Settings
    }
    
]