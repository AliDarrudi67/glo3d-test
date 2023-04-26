import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {PeriodicElement} from "../../interfaces/media.interface";

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})

export class MediaComponent implements AfterViewInit {
  displayedColumns: string[] = ['fileName', 'startedAt', 'status', 'op'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

const ELEMENT_DATA: PeriodicElement[] = [
  {fileName: 'Hydrogen', startedAt: '2023/2/2 12:45:43', status: 'waiting', op: ''},
];
