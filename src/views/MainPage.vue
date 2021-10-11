<template>
  <div class="text-center pt-5">
    <b-button
        variant="primary"
        @click="showModal"
    >
      Добавить МЛ
    </b-button>
    <modal
        name="table-modal"
        height="100%"
        width="80%"
        :shiftX="1"
    >
      <TableModal/>
    </modal>
  </div>
</template>

<script>
import TableModal from "@/components/TableModal";

export default {
  name: "MainPage",
  components: {
    TableModal
  },
  methods: {
    showModal() {
      this.$modal.show('table-modal');
    }
  }
}
</script>

<style lang="scss">
.btn-primary {
  font-weight: 600 !important;
  font-size: 14px !important;
  background-color: #25B1BA !important;
  border-color: #25B1BA !important;
}
.btn-primary:hover {
  color: #fff !important;
  background-color: #13BFC0 !important;
  border-color: #13BFC0 !important;
}
.btn-primary:focus {
  box-shadow: unset !important;
  color: #fff !important;
  background-color: #02898A !important;
  border-color: #02898A !important;
}
.btn-primary:active {
  color: #fff  !important;
  background-color: #25B1BA !important;
  border-color: #25B1BA !important;
}


.btn-outline-primary {
  font-weight: 600 !important;
  font-size: 14px !important;
  color: #25B1BA !important;
  border-color: #25B1BA !important;
}
.btn-outline-primary:hover {
  color: #fff !important;
  background-color: #13BFC0 !important;
  border-color: #13BFC0 !important;
}
.btn-outline-primary:focus {
  box-shadow: unset !important;
  color: #02898A !important;
  background-color: #fff !important;
  border-color: #02898A !important;
}
.btn-outline-primary:active {
  color: #fff  !important;
  background-color: #25B1BA !important;
  border-color: #25B1BA !important;
}
</style>