import type { Component } from "vue";

export interface IRouteType {
  path: string;
  alias?: string;
  name?: string;
  component: () => Promise<Component>;
  meta?: {
    title: string;
    guest?: boolean;
    open?: boolean;
    requiresAuth?: boolean;
    description?: string;
    pageMeta?: {
      title: string;
      description: string;
      basePath?: string;
      basePathIcon?: string;
    };
  };
  children?: IRouteType[];
}

export interface IRouteGroupType {
  slug?: string;
  link: string;
  title: string;
  icon: string;
  active: boolean;
}

export interface ISidebarRouteType {
  home: IRouteGroupType[];
  payments: IRouteGroupType[];
  transfers: IRouteGroupType[];
  commerce: IRouteGroupType[];
  settings: IRouteGroupType[];
}

export interface ISideNavType {
  routeTitle: string;
  routeIcon: string;
  routeLinkName: string;
}
