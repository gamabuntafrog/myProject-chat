import { signOut } from 'firebase/auth';
import { NavLink } from 'react-router-dom';

const HeaderMenu = ({ user, auth ,setIsOpen }) => {
    
    const outFromAccount = () => {
        signOut(auth).then(res => res)
        setIsOpen(false)
    }

    return (<div className='modal'>
        <div className="header__profile">
            <img src={`${user.photoURL}`} alt="avatar" className="header__avatar"/>
            <h3>{user.displayName}</h3>
        </div>
        <NavLink onClick={outFromAccount} className={'header__link'} to={'/login'}>
            Выйти
        </NavLink>
        <NavLink onClick={() => setIsOpen(false)} className={'header__link'} to={'/search'}>
            Поиск
        </NavLink>
        <NavLink onClick={() => setIsOpen(false)} className={'header__link'} to={'/about'}>
            Про сайт
        </NavLink>    
        <button onClick={() => setIsOpen(false)} className="header__close-modal">
            <img className="burger-icon" src={'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1024px-Hamburger_icon.svg.png'} alt="close"/>
        </button>
    </div>);
}

export default HeaderMenu;
