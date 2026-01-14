/**
 * Mock server configuration - declarative route definitions
 * attempted 1:1 with a stubbyData configuration
 */

export interface MockRoute {
  request: {
    url: string | RegExp;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  };
  response: {
    status: number;
    body: string | object;
    headers?: Record<string, string>;
  };
}

export const mockRoutes: MockRoute[] = [
  {
    request: {
      url: /^\/$/,
      method: "GET",
    },
    response: {
      status: 200,
      body: "Hello",
    },
  },
  // Add more routes here as needed
  // {
  //   request: {
  //     url: /^\/api\/messages$/,
  //     method: "POST",
  //   },
  //   response: {
  //     status: 201,
  //     body: { success: true, id: "123" },
  //   },
  // },
];
