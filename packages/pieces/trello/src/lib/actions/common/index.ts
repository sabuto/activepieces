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
