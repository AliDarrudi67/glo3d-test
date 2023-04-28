export class MediaModel {
  id!: number
  createTs!: number
  uploadStartTs!: number
  uploadEndTs!: number
  uploadState!: "error" | "done" | "notStart"
  uploadMessage!: string
  originalFileName!: string
  file!: File
  url!: string
  key!: string

  constructor(file: File) {
    this.file = file;
  }
}
