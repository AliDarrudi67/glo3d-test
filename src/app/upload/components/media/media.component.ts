import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MediaModel} from "../../interfaces/media";
import {FileUploadService} from "../../services/upload.service";
import {async, concatMap, iif, interval, map, mergeMap, Observable, switchMap, take} from "rxjs";
import {percentage} from "@angular/fire/storage";

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})

export class MediaComponent implements AfterViewInit {
  ELEMENT_DATA: MediaModel[] = [];
  @ViewChild('uploadInput') uploadInput!: ElementRef<HTMLElement>;
  displayedColumns: string[] = ['fileName', 'startedAt', 'status', 'op'];
  dataSource = new MatTableDataSource<MediaModel>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedFiles!: FileList;
  currentFileUpload!: MediaModel;
  percentage = 0;
  uploadCounter = 0

  constructor(private uploadService: FileUploadService) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openExplorer() {
    let el: HTMLElement = this.uploadInput.nativeElement;
    el.click();
  }

  selectFile($event: any) {
    this.selectedFiles = $event.target.files;
    for (let index = 0; index < this.selectedFiles.length; index++) {
      this.addToTable(this.selectedFiles[index], index)
      this.upload(index)
    }
  }

  upload(index: number) {
    this.percentage = 0
    const file: File | null = this.selectedFiles[index];

    if (file) {
      console.log('upload')
      this.currentFileUpload = new MediaModel(file);

      this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
        (percentage => {
          this.percentage = Math.round(percentage ? percentage : 0);
        })
      )
      // const result = clicks.pipe(
      //   concatMap(ev => interval(1000).pipe())
      // );
      // result.subscribe(percentage => {
      //   this.percentage = Math.round(percentage ? percentage : 0);
      // });

      // this.uploadService.pushFileToStorage(this.currentFileUpload).pipe(
      //   switchMap(() => interval(100))).subscribe(
      //   percentage => {
      //     this.percentage = Math.round(percentage ? percentage : 0);
      //     this.uploadCounter = index
      //   }
      // )
      // this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
      //   (percentage=>{
      //     this.percentage = Math.round(percentage ? percentage : 0);
      //     this.uploadCounter = index
      //   })
      // );
    }
  }

  addToTable(selectedFile: File, index: number) {
    this.ELEMENT_DATA.push({
        id: index + 1,
        createTs: selectedFile.lastModified,
        uploadStartTs: selectedFile.lastModified,
        uploadEndTs: 0,
        uploadState: "notStart",
        uploadMessage: '',
        originalFileName: selectedFile.name,
        file: selectedFile,
        url: '',
        key: ''
      }
    )
    this.dataSource.data = this.ELEMENT_DATA
  }

  cancelUpload(index:number) {
    console.log('cancel')
    const file: File | null = this.selectedFiles[index];
    this.currentFileUpload = new MediaModel(file);
    this.uploadService.deleteFile(this.currentFileUpload)
    this.ELEMENT_DATA.splice(index,1)
    this.dataSource.data = this.ELEMENT_DATA

  }
}

