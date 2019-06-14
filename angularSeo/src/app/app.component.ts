import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'HN FEED';
  subtitle = 'We <3 hacker news';
  displayedColumns: string[] = [ 'created_at_i', 'title','created', 'action'];
  exampleDatabase: ExampleHttpDatabase | null;
  data: GithubIssue[] = [];
  dataDeleted : any[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private _httpClient: HttpClient) {}


  onClick(url){
    window.open(url, "_blank");
  }
  changeState(p:string){
    let a = JSON.stringify({ title: p });
    
    console.log('salio   ' + a);
    merge()
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.exampleDatabase!.deleteRecord(a);
      }),
      map(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        let database: GithubIssue[] = [];
        for (let index = 0; index < this.data.length; index++) {
          const element:GithubIssue = this.data[index];
            
              if(element.title != p){
                database.push(element);
              }
        }

           
        
        
        return database;
      }),
      catchError(error => {
        console.error('salida de error: ' + error);
        this.isLoadingResults = false;
        // Catch if the GitHub API has reached its rate limit. Return empty data.
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => {this.data = []; this.data = data;  
       });
  }

  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    
merge()
.pipe(
  startWith({}),
  switchMap(() => {
    this.isLoadingResults = true;
    return this.exampleDatabase!.getDeletes();
  }),
  map(data => {
    // Flip flag to show that loading has finished.
    this.isLoadingResults = false;
    this.isRateLimitReached = false;
    
    return data;
  }),
  catchError(() => {
    this.isLoadingResults = false;
    // Catch if the GitHub API has reached its rate limit. Return empty data.
    this.isRateLimitReached = true;
    return observableOf([]);
  })
).subscribe(data => {   this.dataDeleted = data;



    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;
          let dataprima: GithubIssue[] = [];
          for (let index = 0; index < data.hits.length; index++) {
            const element:GithubIssue = data.hits[index];
            if(element.title == null) 
              element.title = element.story_title; 
            else 
              element.title = element.title;
              
             let existe: boolean = false;
             for (let index = 0; index < this.dataDeleted.length; index++) {      
                if(null != this.dataDeleted[index].title && element.title == this.dataDeleted[index].title){
                  existe = true;
                }
             }
  
             if(!existe){
              dataprima.push(element);
             }
             
          }



          return dataprima;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => { 
       
       
        
         this.data = data;
      });
    });
  }
  
}

export interface GithubApi {
  hits: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
  story_title: string;
  story_url: string;
  created_at_i: string;
  url: string;
  author: string;
}

export class parame{
  title:string;
}
/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getRepoIssues(sort: string, order: string, page: number): Observable<GithubApi> {
    return this._httpClient.get<GithubApi>('https://hn.algolia.com/api/v1/search_by_date?query=nodejs');
  }

  getDeletes(): Observable<string[]> {
    return this._httpClient.get<string[]>('https://zvcroy0j1e.execute-api.us-east-1.amazonaws.com/dev/api/notes',{headers: 
    {'Content-Type': 'application/json'}});
  }

  deleteRecord(record:string){
    let data: any = Object.assign({guid: 'D21ds12x'}, record);
    // return this._httpClient.put<string[]>('https://zvcroy0j1e.execute-api.us-east-1.amazonaws.com/dev/api/notes',param,{headers: 
    // {'Content-Type': 'application/json'}});
    return this._httpClient.post<string[]>('https://zvcroy0j1e.execute-api.us-east-1.amazonaws.com/dev/api/notes/',record,{headers: 
    {'Content-Type': 'application/json'}});
  }
}



