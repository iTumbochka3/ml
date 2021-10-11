<template>
  <div>
<!--    <template #modal-header>-->
      <h2>Создание маршрутных листов</h2>
<!--    </template>-->

      <div class="p-2">
        <div class="d-flex flex-row justify-content-between pb-4">
          <b-button v-b-modal="'ml-edit-modal'" variant="outline-primary">Добавить поле</b-button>
          <b-button variant="primary" @click="sendSheets">Создать маршрутные листы</b-button>
        </div>
        <b-table
            :striped="true"
            :fields="column"
            :items="sheets"
            head-variant="light"
        >
        </b-table>
      </div>
    <MLEditModal/>
  </div>
</template>

<script>
import MLEditModal from "@/components/MLEditModal";
// import axios from "axios";

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
          key: "result",
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
    sendSheets() {
      let result = [];
      for(let i=0; i<this.sheets.length; i++) {
        const sheet = {
          line_uuid: (i+1).toString(),
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
</style>