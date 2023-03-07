import {
  BasicAuthPropertyValue,
  httpClient,
  HttpMethod,
  HttpRequest,
  Property,
} from '@activepieces/framework';

export const trelloCommon = {
  baseUrl: 'https://api.trello.com/1/',
  authentication: Property.BasicAuth({
    description: 'Trello API & Token key acquired from your Trello Settings',
    displayName: 'Trello Connection',
    required: true,
    username: {
      displayName: 'API Key',
      description: 'Trello API Key',
    },
    password: {
      displayName: 'Token',
      description: 'Trello Token',
    },
  }),
  board_id: Property.Dropdown({
    displayName: 'Boards',
    description: 'List of Boards',
    required: true,
    refreshers: ['authentication'],
    options: async (propsValue) => {
      if (propsValue['authentication'] === undefined) {
        return {
          disabled: true,
          placeholder: 'Connect your account first',
          options: [],
        };
      }

      const basicAuthProperty = propsValue[
        'authentication'
      ] as BasicAuthPropertyValue;
      const user = await getAuthorisedUser(
        basicAuthProperty.username,
        basicAuthProperty.password
      );
      const boards = await listBoards(
        basicAuthProperty.username,
        basicAuthProperty.password,
        user['id']
      );

      return {
        options: boards.map((board: { id: string; name: string }) => ({
          value: board.id,
          label: board.name,
        })),
      };
    },
  }),
  list_id: Property.Dropdown({
    displayName: 'Lists',
    description: 'Get the lists from a board',
    required: true,
    refreshers: ['authentication', 'board_id'],
    options: async (propsValue) => {
      if (
        propsValue['authentication'] === undefined ||
        propsValue['board_id'] === undefined
      ) {
        return {
          disabled: true,
          placeholder: 'Please connect your account and select a board',
          options: [],
        };
      }

      const basicAuthProperty = propsValue[
        'authentication'
      ] as BasicAuthPropertyValue;
      const lists = await listBoardLists(
        basicAuthProperty.username,
        basicAuthProperty.password,
        propsValue['board_id'] as string
      );

      return {
        options: lists.map((list: { id: string; name: string }) => ({
          value: list.id,
          label: list.name,
        })),
      };
    },
  }),
};

async function getAuthorisedUser(apikey: string, token: string) {
  const request: HttpRequest = {
    method: HttpMethod.GET,
    url: `${trelloCommon.baseUrl}members/me?key=${apikey}&token=${token}`,
    headers: {
      Accept: 'application/json',
    },
    body: {},
    queryParams: {},
  };
  const response = await httpClient.sendRequest(request);

  return response.body;
}

async function listBoards(apikey: string, token: string, user_id: string) {
  const request: HttpRequest = {
    method: HttpMethod.GET,
    url: `${trelloCommon.baseUrl}members/${user_id}/boards?key=${apikey}&token=${token}`,
    headers: {
      Accept: 'application/json',
    },
    body: {},
    queryParams: {},
  };
  const response = await httpClient.sendRequest<{ id: string; name: string }[]>(
    request
  );

  return response.body;
}

async function listBoardLists(apikey: string, token: string, board_id: string) {
  const request: HttpRequest = {
    method: HttpMethod.GET,
    url: `${trelloCommon.baseUrl}boards/${board_id}/lists?key=${apikey}&token=${token}`,
    headers: {
      Accept: 'application/json',
    },
    body: {},
    queryParams: {},
  };

  const response = await httpClient.sendRequest<{ id: string; name: string }[]>(
    request
  );

  return response.body;
}
