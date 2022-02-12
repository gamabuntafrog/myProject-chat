import { NavLink } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Hearts } from "react-loader-spinner";
import { useContext, useState } from "react";
import { Context } from "../..";
import HeaderMenu from "../HeaderMenu";




const Navbar = () => {


    const {auth} = useContext(Context)

    const [user, isLoading, error] = useAuthState(auth)

    const [isOpen, setIsOpen] = useState(false);

    return (
        <header>
            <div className='title' style={{display: 'flex'}}>
                <h3 style={{ marginRight: '20px'}}>Чат</h3>
                <Hearts color="#ff6347" height={80} width={80} />
            </div>
            <nav className="header__navigation">
                {user ?
                    <div className="header__out-wrapper">
                        <button onClick={() => setIsOpen(!isOpen)} className="header__open-modal">
                            <img className="burger-icon" src={'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1024px-Hamburger_icon.svg.png'} alt="close"/>
                        </button>   
                        {isOpen && <HeaderMenu user={user} auth={auth} setIsOpen={setIsOpen}></HeaderMenu>}
                    </div>
                    :
                    <NavLink className={'header__link'} to={'/chat'}>
                       Войти
                    </NavLink>
                }
            </nav>

        </header>
    );
}

export default Navbar;
