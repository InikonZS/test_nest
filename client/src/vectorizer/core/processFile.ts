export const processFile=(selectedFile: File, onReady: (img: HTMLImageElement)=>void)=>{
    if (!selectedFile){
        return;
    }
    const reader = new FileReader();
    reader.onload = ()=>{
        console.log('loaded');
        const img = new Image();
        img.onload= ()=>{
            onReady(img);
        };
        img.src = reader.result as string;   
    }
    reader.onloadstart = ()=>{
        console.log('loading');
    }
    reader.onerror = ()=>{
        console.log('error');
    }
    reader.onabort = ()=>{
        console.log('abort');
    }
    reader.readAsDataURL(selectedFile);
}