import PowerShell from "node-powershell";
import { writeFile, mkdtemp, rmdir, rm } from "fs/promises"
import { nanoid } from "nanoid";
import { readFileSync } from "fs"

/**
 * Display an prompt showing an image
 * @param imageBuf The buffer of the image
 * @param title The title of the window. 
 * @default title "Image Viewer"
 */
export async function displayImage(imageBuf: Buffer, title = "Image Viewer") {
  const tempImageFolder = await mkdtemp("ps-image")
  const imagePath = tempImageFolder + "/" + nanoid()
  await writeFile(imagePath, imageBuf, "binary")
  const powerShell = new PowerShell({});
  await powerShell.addCommand(`
      # Loosely based on http://www.vistax64.com/powershell/202216-display-image-powershell.html

    [void][reflection.assembly]::LoadWithPartialName("System.Windows.Forms")

    $img = [System.Drawing.Image]::Fromfile("${imagePath}");

    # This tip from http://stackoverflow.com/questions/3358372/windows-forms-look-different-in-powershell-and-powershell-ise-why/3359274#3359274
    [System.Windows.Forms.Application]::EnableVisualStyles();
    $form = new-object Windows.Forms.Form
    $form.Text = "${title}"
    $form.Width = $img.Size.Width;
    $form.Height =  $img.Size.Height;
    $pictureBox = new-object Windows.Forms.PictureBox
    $pictureBox.Width =  $img.Size.Width;
    $pictureBox.Height =  $img.Size.Height;

    $pictureBox.Image = $img;
    $form.controls.add($pictureBox)
    $form.Add_Shown( { $form.Activate() } )
    $form.ShowDialog()
    #$form.Show();`)
  try {
    await powerShell.invoke()
  }
  finally {
    await powerShell.dispose()
    await new Promise(resolve => setTimeout(resolve, 1000)) // wait a bit of time before cleaning the directory to avoid having the resources busy
    await rm(imagePath, { force: true })
    await rmdir(tempImageFolder)
  }
}

// displayImage(readFileSync("./img_lights.jpg")).then(() => console.log("closed prompt"))