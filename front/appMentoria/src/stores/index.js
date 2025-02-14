import { defineStore } from 'pinia'
import { set } from 'vue-demi';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    user: {},
    accessToken: '',
    refreshToken: '',
    language: '',
    availableElementsCard: [],
    svgFront: "", // Almacena el SVG del frente
    svgBack: "",  // Almacena el SVG del reverso
    svgBase64: "", // Almacena el SVG en base64
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    getUser() {
      return this.user
    },
    setAccessToken(accessToken) {
      this.accessToken = accessToken
    },
    getAccessToken() {
      return this.accessToken
    },
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken
    },
    getRefreshToken() {
      return this.refreshToken
    },
    getTypeUser() {
      return this.user.typesUsers_id
    },
    setLanguage(language) {
      this.language = language
    },
    getLanguage() {
      return this.language
    },
    addOrUpdateElement(element) {
      const index = this.availableElementsCard.findIndex(
        (el) => el.id === element.id
      );
      if (index !== -1) {
        // Si ya existe, lo actualiza
        this.availableElementsCard[index] = {
          ...this.availableElementsCard[index],
          ...element,
        };
      } else {
        // Si no existe, lo agrega
        this.availableElementsCard.push(element);
      }
    },
    removeElement(elementId) {
      this.availableElementsCard = this.availableElementsCard.filter(
        (el) => el.id !== elementId
      );
    },
    swapElements(fromId, toId) {
      const fromIndex = this.availableElementsCard.findIndex(el => el.id === fromId);
      const toIndex = this.availableElementsCard.findIndex(el => el.id === toId);

      if (fromIndex !== -1 && toIndex !== -1) {
        const fromElement = this.availableElementsCard[fromIndex];
        const toElement = this.availableElementsCard[toIndex];

        // Si los elementos están en lados diferentes, ajustamos `side`
        if (fromElement.side !== toElement.side) {
          const tempSide = fromElement.side;
          fromElement.side = toElement.side;
          toElement.side = tempSide;
        }

        // Intercambiar los índices antes de mover los elementos en el array
        const tempIndex = fromElement.index;
        fromElement.index = toElement.index;
        toElement.index = tempIndex;

        // Ahora intercambiamos los elementos en el array
        const temp = this.availableElementsCard[fromIndex];
        this.availableElementsCard[fromIndex] = this.availableElementsCard[toIndex];
        this.availableElementsCard[toIndex] = temp;
      }
    },
    setSvgFront(svg) {
      this.svgFront = svg;
    },
    setSvgBack(svg) {
      this.svgBack = svg;
    },
    setSvgBase64(base64) {
      this.svgBase64 = base64;
    },
  }
});