<template>
  <div class="pb-5">
    <span class="subtitle is-pulled-right">
      <b-icon class="mr-2" pack="mdi" icon="calendar" size="is-small"> </b-icon>
      {{ $formatDate($today(), "dddd, DD MMMM YYYY") }}
    </span>
  </div>
</template>
