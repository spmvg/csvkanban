<template>
  <div class="ticket">
    <div>
      <button class="btn btn-danger btn-sm"
              @click="delete_ticket(ticket.id)"
              style="float: right"
              >
        <b>✕</b>
      </button>
    </div>
    <div v-for="[ticket_column_name, ticket_value] in Object.entries(ticket.values)"
         :key=ticket_column_name
         class="m-1">
      <h6 class="text-start mx-2">{{ticket_column_name}}</h6>
      <input type="text"
             :list="'ticket-values-'+btoa(ticket_column_name)"
             :value="ticket_value"
             @blur="react_to_form_input($event, ticket.id, ticket_column_name)"
             @keyup="unfocus_text_box"
             :id="'form-input-'+ticket.id+'-'+btoa(ticket_column_name)"
             class="dark-mode-input" />
      <datalist :id="'ticket-values-'+btoa(ticket_column_name)">
        <option v-for="value_suggestion in options_per_column[ticket_column_name]" :key="value_suggestion">{{ value_suggestion }}</option>
      </datalist>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'ticket',
    'options_per_column',
    'view',
    'react_to_form_input',
    'delete_ticket',
  ],
  methods: {
    btoa: function (input) { return btoa(input) },
    unfocus_text_box(event) {
      if (event.key === 'Enter' || event.key === 'Escape') {
        event.srcElement.blur()
      }
    }
  },
};
</script>

<style scoped>
  .ticket {
    border: 1px solid #222;
    background-color: rgb(43, 43, 43);
    cursor: grab;
  }
</style>
