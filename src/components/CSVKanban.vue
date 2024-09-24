<template>
  <div>
    <div class="col-11 col-md-8 col-lg-6 mx-auto p-3 m-2 md"
         v-if="csv_columns.length == 0">
      <div class="m-5">
        <input class="form-control form-control-lg"
               id="formFileInput"
               type="file"
               accept=".csv"
               @change="drop_file">
      </div>
      <div class="m-3">
        <h1 class="m-3"
            style="font-family: Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace;">
          CSVKanban
        </h1>
        <span>
          Turn CSV files into a simple kanban board.
        </span>
      </div>
      <div>
        <ul>
          <li><b>Privacy first:</b> your data stays in the browser and on your local filesystem.</li>
          <li><b>Open source:</b> contribute via GitHub.</li>
        </ul>
      </div>
    </div>
    <div class="m-2"
         v-if="csv_columns.length != 0">
      <div>
        <table class="mx-3 columns-table table"
               :style="'width: '+((sliced_columns.length + 1)*column_width_px)+'px'">
          <thead>
            <tr>
              <th class="text-center column">
                <select class="form-select dark-mode-input"
                        v-model="view"
                        >
                  <option value="">-</option>
                  <option v-for="column in csv_columns" :key="column">{{ column }}</option>
                </select>
              </th>
              <th v-for="column in sliced_columns"
                  :key="column"
                  class="text-center column">
                <h4>{{column}}</h4>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="my-1 mx-1 py-2 px-3 column"
                  :style="'width: '+column_width_px+'px'">
                <div>
                  <button type="button"
                          class="btn btn-primary dark-mode-button btn-lg"
                          @click="save_to_file()"
                          >
                    💾
                  </button>
                  <button type="button"
                          class="btn btn-primary dark-mode-button btn-lg"
                          @click="add_item('', '')">
                    +
                  </button>
                </div>
                <div>
                  <draggable class="draggable-list"
                             v-model="tickets['']"
                             item-key="id"
                             group="columns"
                             @add="react_to_drag($event, '')"
                             @update="react_to_drag($event, '')">
                    <template #item="{element}">
                      <TicketComponent class="mx-1 my-1"
                                       :id="'dragged-item-'+element.id"
                                       :ticket="element"
                                       :options_per_column="options_per_column"
                                       :view="view"
                                       :react_to_form_input="react_to_form_input"
                                       :delete_ticket="delete_ticket" />
                    </template>
                  </draggable>
                </div>
              </td>
              <td v-for="column in sliced_columns"
                  :key="column"
                  class="my-1 mx-1 py-2 px-3 column"
                  :style="'width: '+column_width_px+'px'">
                <div>
                  <button type="button"
                          class="btn btn-primary dark-mode-button btn-lg"
                          @click="add_item(view, column)">
                    +
                  </button>
                </div>
                <div>
                  <draggable class="draggable-list"
                             v-model="tickets[column]"
                             item-key="id"
                             group="columns"
                             @add="react_to_drag($event, column)"
                             @update="react_to_drag($event, column)">
                    <template #item="{element}">
                      <TicketComponent class="mx-1 my-1"
                                       :id="'dragged-item-'+element.id"
                                       :ticket="element"
                                       :options_per_column="options_per_column"
                                       :view="view"
                                       :react_to_form_input="react_to_form_input"
                                       :delete_ticket="delete_ticket" />
                    </template>
                  </draggable>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  import draggable from 'vuedraggable';

  import TicketComponent from './TicketComponent.vue'

  export default {
    name: 'CSVKanban',
    components: {
      draggable,
      TicketComponent,
    },
    data: function () {
      return {
        file_data: [],
        csv_columns: [],
        view: "",
        column_width_px: 300,
        unsaved_changes: false,
      }
    },
    computed: {
      tickets: function () {
        var result = {
          '': []  // always have a null column
        };
        var id = 0;
        for (let item of this.file_data) {
          var key = item[this.view];
          if (!key) {  // view can be ""
            key = ""
          }
          if (!result[key]) {
            result[key] = []
          }
          result[key].push({
            id: id,
            values: item,
          })
          id = id + 1
        }
        console.debug("Tickets:", result)
        return result;
      },
      options_per_column: function () {
        var result = {};
        for (let item of this.file_data) {
          for (let column_name of Object.keys(item)) {
            if (!result[column_name]) {
              result[column_name] = [];
            }
            if (!result[column_name].includes(item[column_name])) {
              result[column_name].push(item[column_name])
            }
          }
        }
        return result;
      },
      sliced_columns: function () {
        var result = new Set();
        for (let item of this.file_data) {
          if (item[this.view]) {
            result.add(item[this.view]);
          }
        }
        return [...result].sort();
      }
    },
    created: function () {},
    mounted: function () {
      window.addEventListener('beforeunload', this.prevent_exit_on_unsaved_changes);
    },
    beforeUnmount() {
      window.removeEventListener('beforeunload', this.prevent_exit_on_unsaved_changes);
    },
    methods: {
      prevent_exit_on_unsaved_changes(event) {
        if (this.unsaved_changes) {
          event.preventDefault();
          event.returnValue = '';
        }
      },
      set_csv_columns() {
        var result = []

        if (this.file_data.length == 0) {
          this.csv_columns = []
          return
        }

        // TODO: repeating column names
        for (let column_name of Object.keys(this.file_data[0])) {
          if (column_name) {
            result.push(column_name);
          }
        }
        this.csv_columns = result
      },
      drop_file(event) {
        const file = event.target.files[0]
        if (!file) { return }

        this.filename = file.name
        var self = this
        const reader = new FileReader()
        reader.onloadend = function (e) {
          var rows = d3.csvParse(e.target.result)
          var return_values = []
          rows.forEach(row => {
            return_values.push(row)
          })
          self.file_data = return_values
          self.set_csv_columns()
          document.title = file.name
        }
        reader.readAsText(file)
      },
      react_to_form_input(event, ticket_id, column_name) {
        console.debug("Changing value for ticket_id", ticket_id, "in column", column_name, "with event", event)
        this.file_data[ticket_id][column_name] = document.getElementById(event.target.id).value
        this.unsaved_changes = true
      },
      react_to_drag(event, destination_column) {
        console.debug(event)
        var new_index = event.newIndex

        // this.ticket has already been adjusted: now we must reflect the change in self.file_data
        var top = this.tickets[destination_column] ? this.tickets[destination_column][new_index - 1] : undefined
        var bottom = this.tickets[destination_column] ? this.tickets[destination_column][new_index + 1] : undefined

        var destination_id = undefined
        if (!top && !bottom) {  // no tickets in list
          destination_id = 0  // put at top of entire sheet
        } else if (bottom) {
          destination_id = Math.max(bottom.id - 1, 0) // try to put on top of previous
        } else if (top) {  // no bottom, so put under top
          destination_id = Math.min(top.id + 1, this.file_data.length)
        }
        var id = parseInt(event.item.id.substring(13))
        console.debug('Drag ticket', id, 'to column', destination_column, 'and destination ID', destination_id, 'in view', this.view)

        // modify content
        if (this.view != '') { this.file_data[id][this.view] = destination_column }

        // reshuffle
        var old_element = this.file_data[id]
        this.file_data.splice(id, 1)
        this.file_data.splice(destination_id, 0, old_element)
        this.unsaved_changes = true
      },
      add_item(column, value) {
        console.debug('Adding a ticket in column', column, ', value', value)
        var item = {}
        this.csv_columns.forEach(loop_column => {
          item[loop_column] = ''
        })
        if (column != "") { item[column] = value }
        this.file_data.unshift(item)
        this.unsaved_changes = true
      },
      delete_ticket(ticket_id) {
        console.debug('Deleting ticket', ticket_id)
        this.file_data.splice(ticket_id, 1)
        this.unsaved_changes = true
      },
      save_to_file() {
        const blob = new Blob([d3.csvFormat(this.file_data)], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = this.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        this.unsaved_changes = false
      }
    }
  }
</script>

<style scoped>
  .md {
    text-align: left;
    background-color: rgb(43, 43, 43);
    border-radius: 10px;
  }

  .column {
    background-color: rgb(60, 63, 65);
    border-left: solid 3px rgb(43, 43, 43);
    border-right: solid 3px rgb(43, 43, 43);
    border-bottom: solid 3px rgb(43, 43, 43);
    border-top: solid 3px rgb(43, 43, 43);
    color: #ddd;
  }

  .columns-table {
    overflow-x: scroll;
  }

  table {
    background-color: rgb(43, 43, 43);
    width: 100%;
  }

  tr, td {
    border: 2px solid rgb(60, 63, 65);
  }

  h1 {
    text-align: center;
  }

  span, li {
    font-size: 20px;
  }
</style>
