

/*
    This simple web component just manually creates a set of plain sliders for the
    known parameters, and uses some listeners to connect them to the patch.
*/
class MyView extends HTMLElement
{
    constructor (patchConnection)
    {
        // Super allows the use of the "this" keyword
        super();
        this.patchConnection = patchConnection;
        this.classList.add("view-patch-element");
        this.innerHTML = this.getHTML();
    }

    connectedCallback()
    {
        this.paramListener = (event) =>
        {
            const slider = this.querySelector ("#" + event.endpointID);

            if (slider)
                slider.value = event.value;
        };

        // Attach a parameter listener that will be triggered when any param is moved
        this.patchConnection.addAllParameterListener (this.paramListener);

        for (const param of this.querySelectorAll (".param"))
        {
            // When one of our sliders is moved, this will send the new value to the patch.
            param.oninput = () => this.patchConnection.sendEventOrValue (param.id, param.value);

            // for each slider, request an initial update, to make sure it shows the right value
            this.patchConnection.requestParameterValue (param.id);
        }
    }

    disconnectedCallback()
    {
        // When the view is removed from the DOM, we should remove our listeners
        this.patchConnection.removeAllParameterListener (this.paramListener);
    }

    getHTML()
    {
    return `
    <style>
        .view-patch-element {
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

        .view-patch-element #tap-logo {
            margin-top: 10px;
            top: 10px;
            width: 200px;
        }
        
        .param {
            display: inline-block;
            margin: 10px;
            width: 200px;
        }
    </style>

    <body>
        <img id="tap-logo" src="./Resources/tap_logo.png" alt="tap logo">

        <div id="controls">
          <input type="range" class="param" id="frequencyIn" min="20" max="20000">Frequency</input>
          <input type="range" class="param" id="volume" min="-84" max="6">Gain</input>
        </div>`;
    }
}

window.customElements.define ("simplegain-view", MyView);

/* This is the function that a host (the command line patch player, or a Cmajor plugin
   loader, or our VScode extension, etc) will call in order to create a view for your patch.

   Ultimately, a DOM element must be returned to the caller for it to append to its document.
   However, this function can be `async` if you need to perform asyncronous tasks, such as
   fetching remote resources for use in the view, before completing.
*/
export default function createPatchView (patchConnection)
{
    return new MyView (patchConnection);
}
