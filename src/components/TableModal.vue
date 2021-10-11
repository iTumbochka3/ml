<template>
  <div class="px-5 py-4">
    <h2 class="h2-custom-header py-3">Создание маршрутных листов</h2>
    <hr/>
    <div class="py-3">
      <div class="d-flex flex-row justify-content-between pb-4">
        <b-button variant="outline-primary" @click="showModal">
          <b-icon icon="plus" aria-hidden="true"></b-icon>
          Добавить поле
        </b-button>
        <b-button variant="primary" @click="sendSheets">
          <b-icon icon="check" aria-hidden="true"></b-icon>
          Создать маршрутные листы
        </b-button>
      </div>
      <div class="py-3">
        <b-table
            :striped="true"
            :fields="column"
            :items="sheets"
            class="table"
        />
      </div>
    </div>
    <modal
        name="ml-modal"
        height="510px"
        width="850px"
    >
      <MLEditModal/>
    </modal>
  </div>
</template>

<script>
import MLEditModal from "@/components/MLEditModal";

export default {
  name: "TableModal",
  components: {
    MLEditModal
  },
  data() {
    return {
      column: [
        {
          key: "counterparty.name",
          label: "Перевозчик"
        },
        {
          key: "contract.name",
          label: "Договор"
        },
        {
          key: "phone_number",
          label: "Телефон"
        },
        {
          key: "date_loading",
          label: "Дата погрузки"
        },
        {
          key: "date_unloading",
          label: "Дата выгрузки"
        },
        {
          key: "individual.name",
          label: "Водитель"
        },
        {
          key: "trailer.number",
          label: "ТС/прицеп"
        },
        {
          key: "result_text",
          label: "Описание ошибки"
        },
      ],
    }
  },
  computed: {
    sheets() {
      return this.$store.state.sheets;
    }
  },
  methods: {
    showModal() {
      this.$modal.show('ml-modal');
    },
    sendSheets() {
      let result = [];
      for (let i = 0; i < this.sheets.length; i++) {
        const sheet = {
          line_uuid: (i + 1).toString(),
          need_uuid: '75f6c17d-d4e3-11eb-80d9-00155d3b3502',
          counterparty_uuid: this.sheets[i].counterparty.uuid,
          contract_uuid: this.sheets[i].contract.uuid,
          individual_uuid: this.sheets[i].individual.uuid,
          truck_uuid: this.sheets[i].truck ? this.sheets[i].truck.number : '',
          trailer_uuid: this.sheets[i].trailer ? this.sheets[i].trailer.number : '',
          date_loading: this.sheets[i].date_loading,
          date_unloading: this.sheets[i].date_unloading
        }
        result.push(sheet)
      }
      this.$store.dispatch('sendSheets', result);
    }
  },
}
</script>

<style lang="scss">

.h2-custom-header {
  text-align: left;
  color: #575757;
  font-weight: 600;
  font-size: 24px;
}

.table {
  tr {
    vertical-align: middle;
  }
  th {
    background-color: #25B1BA !important;
    color: white;
    border: 1px solid white;
    font-weight: 600;
  }
  th:first-child {
    border-top-left-radius: 5px;
  }
  th:last-child {
    border-top-right-radius: 5px;
  }
  td {
    border: 1px solid white;
  }
}
</style>