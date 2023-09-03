import React, { useMemo, useState } from "react";
import { getData, login, register } from "./api";

export function App() {
    const [loginInput, setLoginInput] = useState({ login: '', password: '' });
    const [isLogined, setLogined] = useState(false);
    return <div>
        {
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
            
        }
        <button onClick={async ()=>{
            const response = await getData();
            const data = await response.text();
            console.log(data);
        }}>for authorized</button>

    </div>
}