import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';
import { inject as service } from '@ember/service';
import AuthService from 'shlack/services/auth';

export default class ChatContainerComponent extends Component {
  @tracked
  messages = [];

  /**
   * @type {AuthService}
   */
  @service auth;

  @action
  async loadMessages() {
    const {
      channel: { id, teamId },
    } = this.args;

    const resp = await fetch(`/api/teams/${teamId}/channels/${id}/messages`);
    // this.messages = [...this.messages, ...(await resp.json())];
    // this.messages.push(...(await resp.json()));
    // this.messages = this.messages
    this.messages = await resp.json();
  }

  @action
  async deleteMessage(messageId) {
    
    const resp = await fetch(`/api/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const messageIds = this.messages.map((m) => m.id);
    const IdxToDelete = messageIds.indexOf(messageId);
    this.messages.splice(IdxToDelete, 1);
    this.messages = this.messages; //for tracked
  }

  @action
  async createMessage(body) {
    const {
      channel: { id: channelId, teamId },
    } = this.args;
    const userId = this.auth.currentUserId;
    const resp = await fetch(`/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamId,
        channelId,
        userId,
        body,
      }),
    });
    if (!resp.ok) throw Error("couldn't save the chat message");
    const messageData = await resp.json();
    const user = await (await fetch(`/api/users/${userId}`)).json();
    this.messages = [...this.messages, { ...messageData, user }];
  }
}
