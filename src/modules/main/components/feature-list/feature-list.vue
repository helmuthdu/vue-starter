<template>
  <div>
    <div class="field">
      <label class="label">Search</label>
      <div class="control">
        <input class="input" placeholder="search" type="text" @input="onInput" />
      </div>
    </div>
    <table class="table is-bordered is-fullwidth">
      <thead>
        <tr>
          <th>Type</th>
          <th>CSS class</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="feature in features" :key="feature.type">
          <th>{{ feature.type }}</th>
          <td>
            <code v-for="css in feature.css" :key="css.name">
              <a :href="css.url">{{ css.name }}</a>
            </code>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { useObservable, useSubject } from '@/hooks/observer.hook';
import { useStorage } from '@/hooks/storage.hook';
import { featuresApi } from '@/modules/main/api/features.api';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { defineComponent, ref } from 'vue';
import { Feature } from '../../entities/feature/feature.type';

export default defineComponent({
  name: 'FeatureList',
  async setup() {
    const featureList = ref<Feature[]>([]);
    const features = ref<Feature[]>([]);

    const { subject: search$, setSubject: setSearch$ } = useSubject<string | null>();

    useObservable(
      search$.pipe(
        debounceTime(300),
        filter((query) => !query || query.length >= 3 || query.length === 0),
        distinctUntilChanged(),
        map((query) => query?.toLowerCase()),
        tap((query) => {
          searchStorage.value.query = query ?? '';
        }),
        map((query) =>
          featureList.value.filter((feat) => {
            if (!query) return true;
            return (
              feat.type.toLowerCase().includes(query) || feat.css.some((css) => css.name.toLowerCase().includes(query))
            );
          }),
        ),
        tap((val) => {
          searchStorage.value.total = val.length;
        }),
      ),
      [],
      features,
    );

    const feats = await featuresApi.get();
    features.value = feats;
    featureList.value = feats;

    const searchStorage = useStorage('search', { total: 0, query: '' });

    return {
      features,
      onInput(evt: any) {
        setSearch$(evt.target.value);
      },
    };
  },
});
</script>
