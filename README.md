# image prompt

![](https://i.imgur.com/PcbGaKt.png)
Display an image prompt from node js


## Example: 
```js
const { displayImage } = require("../dist")
const { readFileSync } = require("fs")

displayImage(readFileSync("./img_lights.jpg"), "aurealis borealis").then(() => console.log("closed prompt"))
```
Display an image

## Doc:

### Display an prompt showing an image:
`function displayImage(imageBuf: Buffer, title?: string): Promise<void>`

`imageBuf` — The buffer of the image

`title` — The title of the window.

Return an promise that will be suceeded when the image prompt will be closed