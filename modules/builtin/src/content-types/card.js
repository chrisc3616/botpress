const ActionButton = require('./action_button')
const Carousel = require('./carousel')
const utils = require('./_utils')

module.exports = {
  id: 'builtin_card',
  group: 'Built-in Messages',
  title: 'card',

  jsonSchema: {
    description: 'module.builtin.types.card.description',
    type: 'object',
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        title: 'title'
      },
      subtitle: {
        type: 'string',
        title: 'subtitle'
      },
      image: {
        type: 'string',
        $subtype: 'media',
        $filter: '.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*',
        title: 'image'
      },
      actions: {
        type: 'array',
        title: 'module.builtin.actionButton',
        items: ActionButton.jsonSchema
      }
    }
  },

  uiSchema: {},

  computePreviewText: formData => formData.title && `Card: ${formData.title}`,
  renderElement: (data, channel) => {
    // These channels now use channel renderers
    if (['telegram', 'twilio', 'slack', 'smooch', 'vonage'].includes(channel)) {
      return utils.extractPayload('card', data)
    }

    return Carousel.renderElement({ items: [data], ...data }, channel)
  }
}
