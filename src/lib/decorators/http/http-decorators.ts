import * as methods from './http-methods-decorators';
import * as params from './http-params-decorators';

export namespace Http {
  export import GET = methods.GET;
  export import POST = methods.POST;
  export import PUT = methods.PUT;
  export import DELETE = methods.DELETE;
  export import PATCH = methods.PATCH;
  export import HEAD = methods.HEAD;
  export namespace Param {
    export import Query = params.Query;
    export import Path = params.Path;
    export import Body = params.Body;
    export import Cookie = params.Cookie;
    export import Header = params.Header;
  }
}
