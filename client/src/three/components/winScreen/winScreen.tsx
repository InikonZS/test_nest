import React from "react";

export function WinScreen({ onMenu }: { onMenu: () => void }) {
    return <div className="base_popup_shadow">
        <div className="base_popup_window">
            <div>
                win
            </div>
            <button onClick={() => {
                onMenu();
            }}>menu</button>
        </div>
    </div>
}