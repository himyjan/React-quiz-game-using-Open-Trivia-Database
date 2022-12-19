import { ofetch } from 'ofetch';

const api = {
  hostname: 'https://opentdb.com/api.php',
  async getQuiz() {
    const response = await ofetch(
      `${this.hostname}?amount=1&type=multiple`
    );
    return await response;
  },
};

export default api;
