import {
  createTrigger,
  httpClient,
  HttpMethod,
  HttpRequest,
  Property,
  TriggerStrategy,
} from '@activepieces/framework';
import { trelloCommon } from '../common';

interface WebhookInformation {
  id: string;
}

export const newCard = createTrigger({
  name: 'new_card',
  displayName: 'New Card',
  description: 'Will trigger when a new card is created',
  type: TriggerStrategy.WEBHOOK,
  props: {
    authentication: trelloCommon.authentication,
    listId: Property.ShortText({
      description: 'The ID of the list',
      displayName: 'List ID',
      required: true,
    }),
  },
  sampleData: {
    id: '5abbe4b7ddc1b351ef961414',
    address: '<string>',
    badges: {
      attachmentsByType: {
        trello: {
          board: 2154,
          card: 2154,
        },
      },
      location: true,
      votes: 2154,
      viewingMemberVoted: false,
      subscribed: false,
      fogbugz: '<string>',
      checkItems: 0,
      checkItemsChecked: 0,
      comments: 0,
      attachments: 0,
      description: true,
      due: '<string>',
      start: '<string>',
      dueComplete: true,
    },
    checkItemStates: ['<string>'],
    closed: true,
    coordinates: '<string>',
    creationMethod: '<string>',
    dateLastActivity: '2019-09-16T16:19:17.156Z',
    desc: "👋Hey there,\n\nTrello's Platform team uses this board to keep developers up-to-date.",
    descData: {
      emoji: {},
    },
    due: '<string>',
    dueReminder: '<string>',
    email:
      'bentleycook+2kea95u7kchsvqnxkwe+2q0byi6qv4pt9uc7q5m+25qyyohtzg@boards.trello.com',
    idBoard: '5abbe4b7ddc1b351ef961414',
    idChecklists: [
      {
        id: '5abbe4b7ddc1b351ef961414',
      },
    ],
    idLabels: [
      {
        id: '5abbe4b7ddc1b351ef961414',
        idBoard: '5abbe4b7ddc1b351ef961414',
        name: 'Overdue',
        color: 'yellow',
      },
    ],
    idList: '5abbe4b7ddc1b351ef961414',
    idMembers: ['5abbe4b7ddc1b351ef961414'],
    idMembersVoted: ['5abbe4b7ddc1b351ef961414'],
    idShort: 2154,
    labels: ['5abbe4b7ddc1b351ef961414'],
    limits: {
      attachments: {
        perBoard: {
          status: 'ok',
          disableAt: 36000,
          warnAt: 32400,
        },
      },
    },
    locationName: '<string>',
    manualCoverAttachment: false,
    name: '👋 What? Why? How?',
    pos: 65535,
    shortLink: 'H0TZyzbK',
    shortUrl: 'https://trello.com/c/H0TZyzbK',
    subscribed: false,
    url: 'https://trello.com/c/H0TZyzbK/4-%F0%9F%91%8B-what-why-how',
    cover: {
      color: 'yellow',
      idUploadedBackground: true,
      size: 'normal',
      brightness: 'light',
      isTemplate: false,
    },
  },
  async onEnable(context) {
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `${trelloCommon.baseUrl}tokens/${context.propsValue['authentication'].password}/webhooks/?key=${context.propsValue['authentication'].username}&callbackURL=https://sabuto-sturdy-couscous-4vrj4g6xpq37jpx-3000.preview.app.github.dev/v1/webhooks/6W1NuyZxJaK34SgxTPzwk&description=test&idModel=${context.propsValue['listId']}`,
      body: {},
      queryParams: {},
    };
    const response = await httpClient.sendRequest(request);

    await context.store?.put<WebhookInformation>('_new_card_in_list_trigger', {
      id: response.body['id'],
    });
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>(
      '_new_card_in_list_trigger'
    );

    if (response !== null && response !== undefined) {
      const request: HttpRequest = {
        method: HttpMethod.DELETE,
        url:
          `${trelloCommon.baseUrl}webhooks/` +
          response.id +
          `?key=` +
          context.propsValue['authentication'].username +
          `&token=` +
          context.propsValue['authentication'].password,
        body: {},
        queryParams: {},
      };

      await httpClient.sendRequest(request);
    }
  },
  async run(context) {
    const body = context.payload.body;
    return [body];
  },
});
