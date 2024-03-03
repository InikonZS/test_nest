import React, { useEffect, useMemo, useState } from "react";
import { getData, login, register } from "./api";
import { CardsView } from "./cards/cardsView";
import { Views } from "./cards/views";
import { App as Three } from "./three/app";
import { App as Pixels } from "./pixels/app";
import { App as Ani} from "./ani/app";
import { App as Word} from "./word/app";
import { App as Ui} from "./ui/app";
import { App as Wf} from "./wf/app";
import { NeirView } from './neir/app';
import  './root.css';

export function App() {
    const [currentGame, setCurrentGame] = useState('');
    const [loginInput, setLoginInput] = useState({ login: '', password: '' });
    const [isLogined, setLogined] = useState(false);
    const games = {
        'cards': Views,
        'three': Three,
        'pixels': Pixels,
        'generation': NeirView,
        'ani': Ani,
        'word': Word,
        'ui': Ui,
        'wf': Wf 
    }

    useEffect(()=>{
        const handlePop = ()=>{
            const page = location.hash.slice(1);
            if (games[page as keyof typeof games]){
                setCurrentGame(page);
            } else {
                location.hash = 'cards';
            }
        }
        window.addEventListener('popstate', handlePop);
        handlePop();
        return ()=>{
            window.removeEventListener('popstate', handlePop);
        }
    }, []);

    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:3000');
        socket.onopen = ()=>{
            console.log('open');
            socket.send(JSON.stringify({
                event: 'events/s2',
                data: 'data1'
            }));
            socket.onmessage = (msg)=>{
                console.log(msg);
            }
        }
        return ()=>{
            socket.close();
        }
    }, []);

    const gameComponent = games[currentGame as keyof typeof games];
    return <div className="root_block">
        {/*
            !isLogined ? (
                <>
                <form onSubmit={(async (e) => {
                    e.preventDefault();
                    const response = await login(loginInput);
                    const result = await response.text();
                    console.log('token ', result);
                    localStorage.setItem('auth-token', result);
                    setLogined(true);
                })}>
                    <div>
                        login
                    </div>
                    <input type="text" value={loginInput.login} onChange={(e) => { setLoginInput((last) => ({ ...last, login: e.target.value })) }}></input>
                    <div>
                        password
                    </div>
                    <input type="password" value={loginInput.password} onChange={(e) => { setLoginInput((last) => ({ ...last, password: e.target.value })) }}></input>
                    <button type="submit">sign in</button>
                </form>

                <form onSubmit={(async (e) => {
                    e.preventDefault();
                    const response = await register(loginInput);
                    const result = await response.text();
                    console.log(result);
                })}>
                    <div>
                        login
                    </div>
                    <input type="text" value={loginInput.login} onChange={(e) => { setLoginInput((last) => ({ ...last, login: e.target.value })) }}></input>
                    <div>
                        password
                    </div>
                    <input type="password" value={loginInput.password} onChange={(e) => { setLoginInput((last) => ({ ...last, password: e.target.value })) }}></input>
                    <button type="submit">register</button>
                </form>
                </>
            ) : (
                <div>
                    success
                    
                </div>
            )
            
            */}
        {/*<button onClick={async ()=>{
            const response = await getData();
            const data = await response.text();
            console.log(data);
        }}>for authorized</button>
    */}
        {/*<CardsView></CardsView>*/}
        {<div className="header_menu">
            <div className="logo"><span className="logo_s">De</span>mo</div>
            {Object.keys(games).map((it)=> <button className={'header_button' +  (currentGame == it? ' header_button_selected': '')} onClick={()=> /*setCurrentGame(it)*/ location.hash = it}>{it}</button>)}
        </div>}
        {/*<Views></Views>*/}
        {/*<Three></Three>*/}
        {gameComponent && React.createElement(gameComponent)}
    </div>
}