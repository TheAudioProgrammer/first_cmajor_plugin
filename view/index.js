
class MyView extends HTMLElement
{
    constructor (patchConnection)
    {
       super(); 
       this.patchConnection = patchConnection;
       this.innerHTML = this.getHTML();
    }

    connectedCallback()
    {
        // How we're going to connect Cmajor params w/ HTML elements
    }

    disconnectedCallback()
    {
        // How we will disconnect when this window is closed
    }

    getHTML()
    {
        return `
        
            // write our html and css here
        
        `;   
    }
}

window.customElements.define ("my-view", MyView);

export default function createPatchView (patchConnection)
{
    return new MyView (patchConnection);
}