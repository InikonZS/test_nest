export class KeyboardSystem {
    lastTimeStamp: number;
    onChangeState: () => void;
    forward: boolean;
    tryJump: boolean;

    constructor() {
        window.addEventListener('keydown', (e) => {
            if (e.code == 'KeyW') {
                this.forward = true;
            }
            if (e.code == 'Space') {
                this.tryJump = true;
            }
            this.onChangeState();
        });
        window.addEventListener('keyup', (e) => {
            if (e.code == 'KeyW') {
                this.forward = false;
            }
            if (e.code == 'Space') {
                this.tryJump = false;
            }
            this.onChangeState();
        });
    }
}