import { ChangeDetectionStrategy, Component, output, viewChild } from '@angular/core';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [
    FileUpload,
  ],
  templateUrl: './upload-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFormComponent {
  protected fileUpload = viewChild<FileUpload>('fileUpload');

  protected loadFile= output<{ name: string, data: { category: string, value: number }[] }>();

  protected uploadHandler(event: FileUploadHandlerEvent): void {
    const file: File = event.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result as string);
          this.loadFile.emit({ name: file.name, data: jsonData });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }

    this.clearFile();
  }

  protected clearFile(): void {
    this.fileUpload()?.clear();
  }
}
