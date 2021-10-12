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
}

.btn-outline-primary {
  font-weight: 600 !important;
  font-size: 14px !important;
}
</style>