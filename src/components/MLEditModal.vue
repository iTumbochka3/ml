<template>
    <div class="p-5">

      <b-icon
          icon="x"
          aria-hidden="true"
          class="custom-close-icon"
          @click="closeModal()"
      />

      <h1 class="h1-custom-header">Добавить маршрутный лист</h1>

      <div class="main-block pt-4">
        <div class="main-block__child">
          <label for="input-counterparty">Перевозчик</label>
          <v-select
              id="input-counterparty"
              label="name"
              :options="counterPartyList"
              :value="(counterParty) ? counterParty.name : ''"
              v-debounce="searchCounterparty"
              @input="setCounterParty"
          >
            <span slot="no-options">Ничего не найдено</span>
          </v-select>
        </div>
        <div class="main-block__child">
          <label for="input-contract">Договор</label>
          <v-select
              id="input-contract"
              label="name"
              :options="contractList"
              v-model="contract"
              :disabled="!counterParty"
          />
        </div>
      </div>

      <div class="main-block pt-4">
        <div class="main-block__child">
          <label>Дата погрузки</label>
          <date-picker
              class="custom-datepicker"
              v-model="dateLoading"
              format="DD.MM.YYYY"
              value-type="format"
              prefix-class="xmx"
          />
        </div>
        <div class="main-block__child">
          <label>Дата выгрузки</label>
          <date-picker
              class="custom-datepicker"
              v-model="dateUnloading"
              format="DD.MM.YYYY"
              value-type="format"
              prefix-class="xmx"
          />
        </div>
      </div>

      <hr class="custom-hr"/>

      <div class="main-block py-1">
        <div class="main-block__child">
          <label for="input-individual">Водитель</label>
          <v-select
              id="input-individual"
              label="name"
              :options="driverList"
              v-model="individual"
              :disabled="!counterParty"
          />
        </div>
        <div class="main-block__child child-block">
          <div class="child-block__subchild">
            <label for="input-truck">ТС</label>
            <v-select
                id="input-truck"
                label="number"
                :options="vehicleList"
                v-model="truck"
                :disabled="!counterParty"
            />
          </div>
          <div class="child-block__subchild">
            <label for="input-trailer">Прицеп</label>
            <v-select
                id="input-trailer"
                label="number"
                :options="trailerList"
                v-model="trailer"
                :disabled="!counterParty"
            />
          </div>
        </div>
      </div>

      <hr class="custom-hr"/>

      <div v-if="resultText" class="error-div">
        Ошибка: {{ resultText }}
      </div>
      <div v-if="errorText" class="error-div">
        Ошибка: {{ errorText }}
      </div>

      <div class="button-div pt-4">
        <div class="button-div__child">
          <b-button
              variant="outline-primary"
              @click="closeModal"
          >
            Отмена
          </b-button>
        </div>
        <div class="button-div__child">
          <b-button
              v-if="currentSheet"
              variant="primary"
              @click=" editData"
          >
            Редактировать
          </b-button>
          <b-button
              v-else
              variant="primary"
              @click="saveData"
          >
            Добавить
          </b-button>
        </div>
      </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
  name: "MLEditModal",
  props: {
    'currentSheetIndex': {
      required: false,
      default() {
        return '';
      }
    },
    'currentSheet': {
      required: false,
      default() {
        return '';
      }
    },
  },
  mounted() {
    if (this.currentSheet) {
      this.initData();
    }
  },
  data() {
    return{
      counterParty: '',
      contract: '',
      dateLoading: moment().format("DD.MM.YYYY"),
      dateUnloading: moment().add(2, "days").format("DD.MM.YYYY"),
      individual: '',
      truck: '',
      trailer: '',
      resultText: '',
      errorText: '',
    }
  },
  computed: {
    counterPartyList() {
      return this.$store.state.counterPartyList;
    },
    contractList() {
      return this.$store.state.contracts;
    },
    driverList() {
      return this.$store.state.drivers;
    },
    vehicleList() {
      return this.$store.state.vehicles;
    },
    trailerList() {
      return this.$store.state.trailers;
    },
  },
  methods: {

    initData() {
      this.counterParty = this.currentSheet.counterparty;
      this.contract = this.currentSheet.contract;
      this.dateLoading = this.currentSheet.date_loading;
      this.dateUnloading = this.currentSheet.date_unloading;
      this.individual = this.currentSheet.individual;
      this.truck = this.currentSheet.truck;
      this.trailer = this.currentSheet.trailer;
      this.resultText = this.currentSheet.result_text ? this.currentSheet.result_text : '';
    },

    async searchCounterparty(search) {
      await this.$store.dispatch('requestCounterPartyList', search)
    },

    setCounterParty(value) {
      this.counterParty = value;
      this.contract = '';
      this.individual = '';
      this.truck = '';
      this.trailer = '';
      this.$store.dispatch('requestContracts', value.uuid);
      this.$store.dispatch('requestDrivers', value.uuid);
      this.$store.dispatch('requestVehicles', value.uuid);
      this.$store.dispatch('requestTrailers', value.uuid);
    },

    customValidate() {
      this.errorText = ''
      if(!this.counterParty) {
        this.errorText+="не заполнено поле \"Перевозчик\"; "
      }
      if(!this.contract) {
        this.errorText+="не заполнено поле \"Договор\"; "
      }
      if(!this.individual) {
        this.errorText+="не заполнено поле \"Водитель\"; "
      }
      if(!this.truck) {
        this.errorText+="не заполнено поле \"ТС\"; "
      }
      return this.errorText;
    },

    saveData() {
      if(!this.customValidate()) {
        this.$store.dispatch('createSheet', {
          counterParty: this.counterParty,
          contract: this.contract,
          dateLoading: this.dateLoading,
          dateUnloading: this.dateUnloading,
          individual: this.individual,
          truck: this.truck,
          trailer: this.trailer,
        });
        this.closeModal();
      }
    },

    editData() {
      if(!this.customValidate()) {
        this.$store.dispatch('editSheet', {
          editIndex: this.currentSheetIndex,
          counterParty: this.counterParty,
          contract: this.contract,
          dateLoading: this.dateLoading,
          dateUnloading: this.dateUnloading,
          individual: this.individual,
          truck: this.truck,
          trailer: this.trailer,
        });
        this.closeModal();
      }
    },

    closeModal() {
      this.$store.dispatch('clearCounterPartyList');
      this.$emit('closeModal');
    }
  }
}
</script>

<style lang="scss">
@import "src/scss/vue-select";
@import "src/scss/vue2-datepicker";

.custom-close-icon {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 30px;
  margin-right: 30px;
  width: 26px;
  height: 26px;
  color: #B9B9C3;
}

.h1-custom-header {
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0px;
  color: #575757;
  text-align: center;
}

.main-block {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: left;
  font-size: 14px;
  color: #828282;

  .main-block__child {
    flex: 1 1 350px;
    display: flex;
    flex-direction: column;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  .child-block {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: left;

    .child-block__subchild {
      flex: 1 1 150px;
      display: flex;
      flex-direction: column;
    }
    .child-block__subchild:first-child {
      margin-right: 0.5em;
    }
    .child-block__subchild:last-child {
      margin-left: 0.5em;
    }
  }
}

.error-div {
  margin-left: 0.5em;
  margin-right: 0.5em;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  text-align: left;
  color: #F2994A;
}

.button-div {
  display: flex;
  flex-direction: row;
  margin-left: 0.5em;
  margin-right: 0.5em;
  justify-content: end;

  .button-div__child {
    margin-left: 1em;
  }
}

.custom-hr {
  margin-left: 0.5em;
  margin-right: 0.5em;
}
</style>