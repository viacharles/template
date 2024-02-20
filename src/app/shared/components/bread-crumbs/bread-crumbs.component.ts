import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
interface IBreadCrumb {
  textI18n: string;
  path: string;
}

@Component({
  selector: 'app-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.scss'],
})
export class BreadCrumbsComponent implements OnInit {
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public pathList: IBreadCrumb[] = [];

  ngOnInit(): void {
    let currentSegPath = '';
    this.activatedRoute.url.subscribe(url => {
      if (url.length !== 0) {
        currentSegPath = url[0].path;
        const Url = `${
          (this.router.url as string).split(currentSegPath)[0]
        }${currentSegPath}`;
        this.pathList = Url.split('/').reduce((list, crumb) => {
          return [
            ...list,
            {
              textI18n: crumb,
              path: list[list.length - 1]
                ? `${list[list.length - 1].path}/${crumb}`
                : crumb,
            },
          ];
        }, [] as IBreadCrumb[]);
        this.pathList[0] = {textI18n: 'home', path: 'home'};
      }
    });
  }

  public goTo(path: string): void {
    this.router.navigateByUrl(path);
  }
}
