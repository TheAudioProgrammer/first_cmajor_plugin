
class MyView extends HTMLElement
{
    constructor (patchConnection)
    {
       super(); 
       this.patchConnection = patchConnection;
       this.innerHTML = this.getHTML();
       this.classList.add ("view-patch-element");
    }

    connectedCallback()
    {
        this.paramListener = event =>
        {
            const slider = this.querySelector ("#" + event.endpointID);

            if (slider)
                slider.value = event.value;
        };

        this.patchConnection.addAllParameterListener (this.paramListener);

        for (const slider of this.querySelectorAll (".param"))
        {
            slider.oninput = () => this.patchConnection.sendEventOrValue (slider.id, slider.value);
            this.patchConnection.requestParameterValue (slider.id);
        }
    }

    disconnectedCallback()
    {
        this.patchConnection.removeAllParameterListener (this.paramListener);
    }

    getHTML()
    {
        return `
            <style>
                .view-patch-element
                {
                    font-family: Verdana, sans-serif;
                    text-align: center;
                    display: block;
                    width: 100%;
                    height: 100%;
                    padding: 10px;
                    overflow: auto;
                    flex-direction: column;
                    align-items: center;
                    background-color: lightblue;
                }

                .view-patch-element #tap-logo
                {
                    margin-top: 10px;
                    top: 10px;
                    width: 200px;
                }

                .param
                {
                    display: inline-block;
                    margin: 10px;
                    width: 200px;
                }

            </style>

            <body>

                <img id="tap-logo" src="./Resources/tap_logo.png" alt="tap logo">

                <div id="controls">
                    <input type="range" min="20" max="20000" value="300" class="param" id="frequencyIn">Frequency</input>
                    <input type="range" min="-84" max="6" value="-12" class="param" id="volume">Gain</input>
                </div>    

            </body>
        `;   
    }
}

window.customElements.define ("my-view", MyView);

export default function createPatchView (patchConnection)
{
    return new MyView (patchConnection);
}