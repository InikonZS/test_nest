import React from "react";

export function FailScreen({ onMenu, onRestart }: { onMenu: () => void, onRestart: () => void }) {
    return <div className="base_popup_shadow">
        <div className="base_popup_window">
            <div>
                fail
            </div>
            <button onClick={() => {
                onRestart();
            }}>try again</button>
            <button onClick={() => {
                onMenu();
            }}>menu</button>
        </div>

    </div>
}