<template>
  <div>
    <v-toolbar flat color="grey lighten-4" class="mt-2" height="60">
      <v-spacer></v-spacer>
      <span class="caption">
        <v-icon class="mr-2" small>mdi-calendar</v-icon>
        {{ $formatDate($today(), "dddd, DD MMMM YYYY") }}
      </span>
    </v-toolbar>
    <v-divider class="ma-3"></v-divider>
  </div>
</template>
