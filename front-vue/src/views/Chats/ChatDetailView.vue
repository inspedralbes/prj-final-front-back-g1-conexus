<template>
  <div
    class="container mx-auto px-5 py-6 min-h-screen flex flex-col animate-fade-in"
    style="max-width: 800px"
  >
    <!-- Chat header -->
    <div
      class="bg-slate-800/50 border-b border-slate-700/50 p-4 rounded-t-xl flex items-center justify-between"
    >
      <button
        class="p-2 text-gray-400 hover:text-purple-400 flex items-center gap-2"
        @click="goBack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Volver</span>
      </button>
      <h2 class="text-white font-medium">{{ chatName }}</h2>
      <div
        v-if="isChatWithCanteen"
        class="p-2 text-gray-400 hover:text-purple-400 cursor-pointer transition-all hover:scale-110"
        @click="showCantinaInfo = true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
    </div>

    <!-- Modal de información sobre pedidos de cantina -->
    <div
      v-if="showCantinaInfo"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in"
    >
      <div
        class="bg-slate-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border border-slate-700"
      >
        <h3
          class="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Com funciona la cantina?
        </h3>
        <div class="space-y-3 text-gray-300">
          <p class="font-medium text-white">
            <strong>Per fer una comanda:</strong>
          </p>
          <ol class="list-decimal pl-5 space-y-2 text-gray-300">
            <li>
              Vés a la secció de <span class="text-blue-400">Cantina</span> del
              menú principal
            </li>
            <li>Selecciona els productes que vulguis demanar</li>
            <li>
              Fes clic a "<span class="text-green-400">Demanar per xat</span>"
              per enviar la comanda
            </li>
          </ol>
          <div
            class="p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg mt-4 text-sm"
          >
            <p class="text-gray-300 mb-2">
              Aquest xat només permet l'enviament de comandes des de la pàgina
              de cantina.
              <span class="text-blue-300"
                >No es poden escriure missatges directament</span
              >.
            </p>
            <p class="font-medium text-white">
              <strong class="text-green-400">Nota:</strong> Pots veure aquí les
              respostes de la cantina sobre l'estat de la teva comanda.
            </p>
          </div>
        </div>
        <button
          @click="showCantinaInfo = false"
          class="mt-5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-lg transition-colors w-full transform hover:-translate-y-1 duration-200"
        >
          D'acord
        </button>
      </div>
    </div>

    <div
      class="chat-messages flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/30 border-x border-slate-700/30 scroll-smooth"
      ref="messagesContainer"
      style="
        height: 60vh;
        min-height: 300px;
        max-height: 70vh;
        overflow-y: auto;
        scroll-behavior: smooth;
      "
    >
      <div v-if="loading" class="flex justify-center items-center h-full">
        <div class="flex flex-col items-center">
          <div class="spinner h-10 w-10 mb-4"></div>
          <p class="text-gray-400">Cargando mensajes...</p>
        </div>
      </div>

      <div
        v-else-if="messages.length === 0"
        class="flex justify-center items-center h-full"
      >
        <div
          class="text-center p-6 bg-slate-700/30 rounded-xl max-w-md mx-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-12 h-12 text-gray-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p class="text-gray-400">¡Bienvenido al chat!</p>
          <p class="text-gray-400 mt-1">
            Envía un mensaje para comenzar a conversar.
          </p>
        </div>
      </div>

      <template v-else>
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="max-w-[65%] group relative"
          :class="{
            'ml-auto bg-blue-600/20 border border-blue-500/30 text-white':
              message.userId.toString() === currentUserId.toString(),
            'mr-auto bg-slate-700/50 text-white':
              message.userId.toString() !== currentUserId.toString(),
            'opacity-75': message.sending,
            'border-red-500/50 bg-red-500/10': message.failed,
            'opacity-70 bg-red-500/10 border border-red-500/30':
              message.deleted,
            'order-message': isOrderMessage(message.message),
          }"
        >
          <div class="flex justify-between text-xs opacity-70 mb-1">
            <span>{{ message.userName }}</span>
            <span>{{ formatDate(message.timestamp) }}</span>
          </div>

          <!-- Message content -->
          <div
            v-if="message.deleted"
            class="italic text-center p-2 text-gray-400"
            :title="getDeletedMessageTooltip(message)"
          >
            <i>Missatge eliminat</i>
          </div>
          <div
            v-else-if="message.hasLinks"
            class="message-content break-words"
            v-html="formatMessageWithLinks(message)"
          ></div>
          <div
            v-else
            class="break-words"
            v-html="
              isOrderMessage(message.message)
                ? formatOrderMessage(message.message)
                : message.message
            "
          ></div>

          <!-- Link Previews -->
          <div
            v-if="
              message.linkPreviews &&
              message.linkPreviews.length > 0 &&
              !message.deleted
            "
            class="mt-2 w-full"
          >
            <div
              v-for="(preview, previewIndex) in message.linkPreviews"
              :key="previewIndex"
              class="bg-white/90 rounded-lg overflow-hidden border border-gray-200 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer max-w-[300px]"
              @click="openLink(preview.url)"
            >
              <div class="flex flex-col">
                <div
                  v-if="preview.image"
                  class="w-full h-[150px] overflow-hidden"
                >
                  <img
                    class="w-full h-full object-cover"
                    :src="preview.image"
                    :alt="preview.title || preview.url"
                  />
                </div>
                <div class="p-3">
                  <div class="font-bold text-sm text-gray-800 mb-1">
                    {{ preview.title || "Sin título" }}
                  </div>
                  <div
                    v-if="preview.description"
                    class="text-xs text-gray-600 mb-1 line-clamp-2"
                  >
                    {{ truncateText(preview.description, 100) }}
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ preview.siteName || extractDomain(preview.url) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="message.sending"
            class="text-xs text-gray-400 mt-1 text-right"
          >
            Enviando...
          </div>
          <div
            v-if="message.failed"
            class="text-xs text-red-500 mt-1 text-right cursor-pointer"
            @click="retryMessage(message, index)"
          >
            Error al enviar - Haz clic para reintentar
          </div>

          <!-- Delete button - Only show for teacher-to-teacher chats -->
          <button
            v-if="
              message.userId.toString() === currentUserId.toString() &&
              !message.sending &&
              !message.failed &&
              !message.deleted &&
              message.id
            "
            class="absolute top-2 right-2 p-1.5 bg-white/20 hover:bg-red-500/20 text-white/70 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            @click="deleteMessage(message)"
            title="Eliminar mensaje"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        <!-- Elemento invisible para hacer scroll automático -->
        <div ref="endOfMessages" class="h-1 w-full" id="end-of-messages"></div>
      </template>
    </div>

    <div
      class="typing-indicator flex justify-start px-4 py-2"
      v-if="someoneIsTyping"
    >
      <div class="inline-flex items-center h-5 px-1.5">
        <span
          class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1 animate-bounce"
        ></span>
        <span
          class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1 animate-bounce"
          style="animation-delay: 0.2s"
        ></span>
        <span
          class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style="animation-delay: 0.4s"
        ></span>
      </div>
    </div>

    <div
      class="chat-input p-4 bg-slate-800/50 border-t border-slate-700/50 rounded-b-xl"
    >
      <!-- Área para mostrar los productos de cantina - only shown when chatting with canteen -->
      <div
        v-if="hasCantinaItems"
        class="w-full bg-slate-700/20 rounded-lg p-4 mb-4 border border-slate-600/30"
      >
        <div class="flex justify-between items-center mb-2">
          <h4 class="text-green-500 font-medium">🛒 Comanda de Cantina</h4>
          <button
            class="p-1.5 hover:bg-gray-200 text-gray-500 hover:text-red-500 rounded-full transition-colors flex items-center justify-center"
            @click="clearCantinaOrder"
            title="Eliminar pedido"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="max-h-[150px] overflow-y-auto mb-2">
          <div
            v-for="(item, index) in appStore.cartCantinaItems"
            :key="index"
            class="flex items-center py-1.5 border-b border-gray-200/20 last:border-b-0"
          >
            <span class="font-bold mr-2 text-gray-700"
              >{{ item.quantity }}x</span
            >
            <span class="flex-1 text-white">{{ item.product_name }}</span>
            <span class="font-bold text-green-500"
              >{{ formatPrice(item.product_price * item.quantity) }} €</span
            >
          </div>
        </div>
        <div
          class="text-right font-bold text-green-500 pt-1.5 border-t border-gray-200/20"
        >
          Total: {{ calculateCantinaTotal() }} €
        </div>

        <!-- Respuestas rápidas para la cantina -->
        <div class="mt-3 pt-3 border-t border-gray-200/20">
          <p class="text-sm text-gray-400 mb-2">
            Preferències per la teva comanda:
          </p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(option, index) in quickOrderOptions"
              :key="index"
              @click="toggleOrderOption(option)"
              class="px-2.5 py-1.5 bg-slate-600/30 rounded-md text-xs transition-all cursor-pointer border"
              :class="
                selectedOrderOptions.includes(option)
                  ? 'border-green-500 bg-green-900/20 text-green-400'
                  : 'border-slate-500/30 text-gray-300 hover:bg-slate-600/50'
              "
            >
              {{ option }}
            </div>
          </div>
          <div
            v-if="selectedOrderOptions.length > 0"
            class="mt-2 text-xs text-blue-400"
          >
            {{ selectedOrderOptions.length }} preferencia(s) seleccionada(s)
          </div>
        </div>
      </div>

      <!-- Popup para insertar enlaces -->
      <div
        v-if="showLinkPopup"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="showLinkPopup = false"
        ></div>
        <div
          class="relative bg-slate-800 rounded-lg shadow-lg p-5 border border-slate-700 w-full max-w-md mx-4 animate-fade-in"
        >
          <h4
            class="text-lg font-medium mb-3 pb-2 border-b border-slate-700 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Insertar enllaç
          </h4>
          <div class="mb-3">
            <label
              for="linkUrl"
              class="block text-sm font-medium text-gray-300 mb-1"
              >URL del enllaç:</label
            >
            <input
              id="linkUrl"
              v-model="linkUrl"
              placeholder="https://example.com"
              type="url"
              class="w-full p-2 border border-slate-600 bg-slate-700/50 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
            />
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="showLinkPopup = false"
              class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="insertLink"
              class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Insertar
            </button>
          </div>
        </div>
      </div>

      <!-- Popup para insertar emojis -->
      <div
        v-if="showEmojiPicker"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/30"
          @click="showEmojiPicker = false"
        ></div>
        <div
          class="relative bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-3 w-[320px] animate-fade-in"
        >
          <div
            class="flex justify-between items-center mb-2 pb-2 border-b border-slate-700"
          >
            <h4 class="text-sm font-medium text-white">Seleccionar emoji</h4>
            <button
              @click="showEmojiPicker = false"
              class="p-1 text-gray-400 hover:text-red-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div class="flex overflow-x-auto pb-2 mb-2 border-b border-slate-700">
            <button
              v-for="(category, index) in emojiCategories"
              :key="index"
              @click="selectEmojiCategory(category)"
              :class="{ 'bg-blue-500/30': currentEmojiCategory === category }"
              class="p-1.5 rounded-md hover:bg-blue-500/20 transition-colors mr-1 text-lg"
            >
              {{ categoryEmojis[index] }}
            </button>
          </div>
          <div class="grid grid-cols-8 gap-1 max-h-[200px] overflow-y-auto">
            <button
              v-for="(emoji, index) in currentCategoryEmojis"
              :key="index"
              @click="addEmoji(emoji)"
              class="p-1.5 hover:bg-slate-700 rounded-md transition-transform hover:scale-110 text-xl"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <!-- Área para mostrar el enlace activo -->
      <div
        v-if="activeLink"
        class="w-full p-2 bg-slate-700/50 rounded-t-lg mb-2 border-b border-slate-600/50"
      >
        <div
          class="flex items-center bg-blue-500/20 border border-blue-500/30 rounded px-2.5 py-1.5 overflow-hidden"
        >
          <span class="text-blue-400 font-bold mr-1">@</span>
          <a
            :href="activeLink"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-400 whitespace-nowrap overflow-hidden text-ellipsis flex-1"
            >{{ activeLink }}</a
          >
          <button
            class="p-1 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full ml-2 flex-shrink-0 transition-colors"
            @click="removeActiveLink"
            title="Eliminar enlace"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex items-end gap-2">
        <div
          class="flex-1 flex items-center bg-slate-700/20 border border-slate-600/30 rounded-lg overflow-hidden"
        >
          <div class="flex-1 relative" ref="messageInputWrapper">
            <textarea
              ref="messageInput"
              v-model="newMessage"
              @keydown.ctrl.enter.prevent="handleCtrlEnter"
              @keydown.enter.exact="handleEnterKey"
              placeholder="Escriu un missatge..."
              @input="handleTyping"
              rows="1"
              class="w-full bg-transparent p-3 text-white resize-none focus:outline-none min-h-[40px] max-h-[120px] placeholder-gray-400"
              :disabled="isChatWithCanteen"
            ></textarea>
            <div
              v-if="isChatWithCanteen"
              class="text-sm text-red-400 bg-red-500/10 p-2 rounded text-center mt-1"
            >
              <strong
                >Només es poden fer comandes des de la pàgina de cantina. No es
                permet escriure.</strong
              >
            </div>
          </div>
          <button
            class="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
            @click="openLinkPopup"
            title="Insertar enlace personalizado"
            :disabled="isChatWithCanteen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              ></path>
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              ></path>
            </svg>
          </button>
          <button
            class="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
            @click="toggleEmojiPicker"
            title="Insertar emoji"
            :disabled="isChatWithCanteen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </button>
        </div>
        <button
          @click="sendMessage"
          :disabled="isChatWithCanteen && !hasCantinaItems"
          class="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </div>
    </div>

    <!-- Modal para mostrar alertas -->
    <div
      v-if="showAlertModal"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black/50"
        @click="showAlertModal = false"
      ></div>
      <div
        class="relative bg-slate-800 rounded-lg shadow-lg p-5 border border-slate-700 w-full max-w-sm mx-4 animate-fade-in"
      >
        <div
          class="flex justify-between items-center mb-3 pb-2 border-b border-slate-700"
        >
          <h4 class="text-lg font-medium text-white">{{ alertTitle }}</h4>
          <button
            @click="showAlertModal = false"
            class="p-1 text-gray-400 hover:text-red-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <p class="text-gray-300 mb-4">{{ alertMessage }}</p>
        <div
          class="flex"
          :class="{
            'justify-between': messageToDelete,
            'justify-end': !messageToDelete,
          }"
        >
          <!-- Solo mostrar botón de cancelar si es una confirmación de eliminación -->
          <button
            v-if="messageToDelete"
            @click="showAlertModal = false"
            class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all"
          >
            Cancel·lar
          </button>

          <!-- Botón principal -->
          <button
            @click="
              messageToDelete
                ? confirmDeleteMessage()
                : (showAlertModal = false)
            "
            :class="{
              'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700':
                messageToDelete,
              'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700':
                !messageToDelete,
            }"
            class="text-white py-2 px-4 rounded-lg text-sm font-medium transition-all hover:-translate-y-1 duration-200"
          >
            {{ messageToDelete ? "Eliminar" : "D'acord" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from "vue";
import io from "socket.io-client";
import { useRoute, useRouter } from "vue-router";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { useAppStore } from "@/stores";
import { getAllUsers } from "@/services/communicationsScripts/mainManager";

const API_URL = import.meta.env.VITE_CHAT_URL;
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "https://www.conexushub.cat";
// Obtener el store de la aplicación
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

// Variables del chat
const socket = ref(null);
const messages = ref([]);
const newMessage = ref("");
const chatName = ref("Chat");
const loading = ref(true);
const activeLink = ref(null); // Nueva variable para almacenar el enlace activo

// Usar datos del usuario actual desde el store
const currentUserId = computed(() =>
  appStore.getUserId() ? appStore.getUserId().toString() : null
);

const currentUserName = computed(
  () => appStore.getUser()?.name || appStore.getUser()?.username || "Usuario"
);

const messagesContainer = ref(null);
const isTyping = ref(false);
const typingTimeout = ref(null);
const someoneIsTyping = ref(false);
const typingUserName = ref("");
const chatId = computed(() => route.params.chatId);
// Caché para evitar mensajes duplicados
const processedMessages = ref(new Set());
const endOfMessages = ref(null); // Referencia al final de los mensajes para scroll

// Variables para el popup de inserción de enlace
const showLinkPopup = ref(false);
const linkUrl = ref("");

// Variables para el selector de emojis
const showEmojiPicker = ref(false);
const currentEmojiCategory = ref("smileys");
const emojiCategories = [
  "smileys",
  "people",
  "animals",
  "food",
  "activities",
  "travel",
  "objects",
  "symbols",
];
const categoryEmojis = ["😀", "👋", "🐶", "🍎", "⚽", "✈️", "💡", "❤️"];

// Emojis por categoría
const emojis = {
  smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
  ],
  people: [
    "👋",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "👇",
    "👍",
    "👎",
    "✊",
    "👊",
    "🤛",
    "🤜",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🙏",
    "✍️",
    "💪",
    "🦾",
    "🦿",
    "🦵",
    "🦶",
    "👂",
    "🦻",
  ],
  animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐽",
    "🐸",
    "🐵",
    "🙈",
    "🙉",
    "🙊",
    "🐒",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
  ],
  food: [
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶️",
    "🌽",
    "🥕",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥯",
  ],
  activities: [
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🪃",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛼",
    "🛷",
  ],
  travel: [
    "✈️",
    "🚀",
    "🚁",
    "🚂",
    "🚃",
    "🚄",
    "🚅",
    "🚆",
    "🚇",
    "🚈",
    "🚉",
    "🚊",
    "🚝",
    "🚞",
    "🚋",
    "🚌",
    "🚍",
    "🚎",
    "🚐",
    "🚑",
    "🚒",
    "🚓",
    "🚔",
    "🚕",
    "🚖",
    "🚗",
    "🚘",
    "🚙",
    "🚚",
    "🚛",
  ],
  objects: [
    "💡",
    "🔦",
    "🧯",
    "🛢️",
    "💸",
    "💵",
    "💴",
    "💶",
    "💷",
    "💰",
    "💳",
    "💎",
    "⚖️",
    "🔧",
    "🔨",
    "⚒️",
    "🛠️",
    "⛏️",
    "🔩",
    "⚙️",
    "🧱",
    "⛓️",
    "🧲",
    "🔫",
    "💣",
    "🧨",
    "🪓",
    "🔪",
    "🗡️",
    "⚔️",
  ],
  symbols: [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉️",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
  ],
};

// Obtener emojis de la categoría actual
const currentCategoryEmojis = computed(() => {
  return emojis[currentEmojiCategory.value] || [];
});

// Función para seleccionar una categoría de emojis
const selectEmojiCategory = (category) => {
  currentEmojiCategory.value = category;
};

// Navegación
const goBack = () => {
  router.push({ name: "chats-list" });
};

// Referencia para el mensaje de pedido de cantina
const cantinaOrderMessage = ref(null);

// Verificar si hay productos en el carrito de cantina
const hasCantinaItems = computed(
  () =>
    // Only show canteen items if we're in a chat with the canteen AND there are items in the cart
    isChatWithCanteen.value && appStore.cartCantinaItems.length > 0
);

// Add a new computed property to check if the current chat is with the canteen user
const isChatWithCanteen = ref(false);

// Función para formatear precio
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

// Calcular el total del pedido de cantina
const calculateCantinaTotal = () => {
  return formatPrice(
    appStore.cartCantinaItems.reduce((total, item) => {
      return total + item.product_price * item.quantity;
    }, 0)
  );
};

// Función para limpiar el pedido de cantina
const clearCantinaOrder = () => {
  // Eliminar todos los items del carrito
  while (appStore.cartCantinaItems.length > 0) {
    appStore.removeFromCartCantina(appStore.cartCantinaItems[0]);
  }

  // Limpiar preferencias seleccionadas
  selectedOrderOptions.value = [];
};

// Generar mensaje con los productos del carrito
const generateCantinaOrderMessage = () => {
  if (!hasCantinaItems.value) {
    return null;
  }

  let message = "🛒 *COMANDA NOVA*\n\n";

  // Agregar encabezado con línea de separación
  message += "┌─────────────────────────────┐\n";

  // Agregar productos
  appStore.cartCantinaItems.forEach((item) => {
    message += `│ ${item.quantity}x ${item.product_name}\n`;
    message += `│ ${" ".repeat(4)}${formatPrice(
      item.product_price * item.quantity
    )} €\n`;
    message += "│\n"; // Línea vacía para separar productos
  });

  // Agregar línea de separación antes del total
  message += "├─────────────────────────────┤\n";

  // Agregar total con formato destacado
  message += `│ 💰 *TOTAL: ${calculateCantinaTotal()} €*\n`;

  // Cerrar el cuadro
  message += "└─────────────────────────────┘";

  // Añadir preferencias seleccionadas si existen
  if (selectedOrderOptions.value.length > 0) {
    message += "\n\n🔖 *Preferencies:*\n";
    selectedOrderOptions.value.forEach((option) => {
      message += `   ✓ ${option}\n`;
    });
  }

  return message;
};

// Conectar al socket cuando el componente se monta
onMounted(async () => {
  // Verificar si el usuario está autenticado
  if (!currentUserId.value) {
    console.warn("No se puede iniciar el chat: usuario no autenticado");
    router.push("/login");
    return;
  }

  // Verificar si hay un pedido de cantina en la URL
  if (route.query.order) {
    cantinaOrderMessage.value = decodeURIComponent(route.query.order);
    // Ya no colocamos el mensaje en el input
  }

  // Cargar datos del chat
  await loadChatData();

  // Conectar al socket
  connectSocket();

  // Marcar mensajes como leídos
  await markMessagesAsRead();

  // Emitir evento de chat visto
  dispatchChatViewEvent("entered");

  // Verificar si hay enlaces en el campo de entrada
  nextTick(() => {
    highlightLinksInInput();
  });

  // Ajustar altura del textarea al montar
  nextTick(() => {
    adjustTextareaHeight();
  });

  // Hacer scroll al último mensaje después de un breve retraso
  setTimeout(() => {
    scrollToBottom();
  }, 300);
});

// Observar cambios en el ID del chat
watch(
  () => route.params.chatId,
  async (newChatId, oldChatId) => {
    if (newChatId !== oldChatId) {
      loading.value = true;
      messages.value = [];
      processedMessages.value.clear();

      // Reset the canteen chat flag when changing chats
      isChatWithCanteen.value = false;

      // Emitir evento de salida del chat anterior
      if (oldChatId) {
        const exitEvent = new CustomEvent("chat-view-exited", {
          detail: {
            chatId: oldChatId,
            userId: currentUserId.value,
          },
        });
        window.dispatchEvent(exitEvent);
      }

      // Desconectar del chat anterior
      if (socket.value && oldChatId) {
        socket.value.emit("leave_chat", {
          chatId: oldChatId,
          userId: currentUserId.value,
        });
      }

      // Cargar datos del nuevo chat
      await loadChatData();

      // Unirse al nuevo chat
      if (socket.value) {
        socket.value.emit("join_chat", {
          chatId: chatId.value,
          userId: currentUserId.value,
          userName: currentUserName.value,
        });
      }

      // Marcar mensajes como leídos para el nuevo chat
      await markMessagesAsRead();

      // Emitir evento de entrada al nuevo chat
      if (newChatId) {
        const enterEvent = new CustomEvent("chat-view-entered", {
          detail: {
            chatId: newChatId,
            userId: currentUserId.value,
          },
        });
        window.dispatchEvent(enterEvent);
      }
    }
  }
);

// Observar cambios en el mensaje para aplicar estilos de enlaces
watch(newMessage, () => {
  highlightLinksInInput();
});

// Cargar datos del chat
const loadChatData = async () => {
  try {
    if (!chatId.value) {
      console.error("No se proporcionó ID de chat");
      router.push({ name: "chats-list" });
      return;
    }

    loading.value = true;

    // Intentar cargar el chat directamente por ID
    let chatData;
    try {
      chatData = await chatManager.getChatById(chatId.value);
    } catch (error) {
      console.error(`Error al cargar chat por ID ${chatId.value}:`, error);
      chatData = null;
    }

    // Si no se encuentra el chat, intentar buscarlo entre todos los chats disponibles
    if (!chatData) {
      try {
        // Obtener todos los chats y filtrar por el ID actual
        const allChats = await chatManager.getAllChats();
        chatData = allChats.find((chat) => chat._id === chatId.value);

        if (!chatData) {
          // Buscar chats donde participa el usuario actual
          const userChats = allChats.filter(
            (chat) =>
              chat.teachers &&
              chat.teachers.includes(parseInt(currentUserId.value))
          );

          if (userChats.length > 0) {
            // Si no se encuentra el chat específico pero hay otros chats del usuario,
            // redirigir al primero de ellos
            router.replace({
              name: "chat-detail",
              params: { chatId: userChats[0]._id },
            });
            return;
          }
        }
      } catch (fallbackError) {
        console.error(
          "Error en la búsqueda alternativa de chats:",
          fallbackError
        );
      }
    }

    if (!chatData) {
      console.error("No se encontró el chat ni alternativas");
      router.push({ name: "chats-list" });
      return;
    }

    // Establecer nombre del chat
    chatName.value = chatData.name || "Chat";

    // Check if we're chatting with the canteen user
    isChatWithCanteen.value = false; // Reset value

    if (chatData.teachers && chatData.teachers.length > 0) {
      // Get the other user in the chat (not current user)
      const otherUserId = chatData.teachers.find(
        (teacherId) => teacherId !== parseInt(currentUserId.value)
      );

      if (otherUserId) {
        try {
          // Get all users to check if the other user is canteen
          const allUsers = await getAllUsers();
          const otherUser = allUsers.find((user) => user.id === otherUserId);

          // Check if other user is canteen (typeUsers_id = 5)
          if (otherUser && otherUser.typeUsers_id === 5) {
            isChatWithCanteen.value = true;
          } else {
            // If not chatting with canteen, clear the cart
            clearCantinaOrder();
          }
        } catch (error) {
          console.error("Error checking if chat is with canteen:", error);
        }
      }
    }

    // Cargar mensajes
    if (chatData.interaction && chatData.interaction.length > 0) {
      // Convertir los mensajes al formato esperado
      messages.value = chatData.interaction.map((msg) => {
        // Verificar si el mensaje es del usuario actual o de otro
        const isOwnMessage = msg.teacherId === currentUserId.value.toString();

        // Verificar si hay enlaces en el mensaje
        const hasLinks = msg.hasLinks || false;
        const links = msg.links || [];
        const linkPreviews = msg.linkPreviews || [];

        // Si no hay información de enlaces pero podría contener URLs, detectarlas
        const detectedLinks = !hasLinks ? detectLinks(msg.message) : [];
        const finalHasLinks = hasLinks || detectedLinks.length > 0;
        const finalLinks = hasLinks ? links : detectedLinks;

        // Check if the message is deleted
        const isDeleted = msg.deleted || false;

        return {
          id: msg._id,
          userId: msg.teacherId,
          userName: isOwnMessage
            ? currentUserName.value
            : `Profesor ${msg.teacherId}`,
          message: msg.message,
          hasLinks: finalHasLinks,
          links: finalLinks,
          linkPreviews: linkPreviews,
          timestamp: new Date(msg.date),
          deleted: isDeleted,
        };
      });

      // Ordenar mensajes por fecha
      messages.value.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    } else {
      // console.log("El chat no tiene mensajes");
      messages.value = [];
    }

    // Actualizar estado
    loading.value = false;

    // Hacer scroll al final de los mensajes
    scrollToBottom();

    // Segundo scroll después de un breve retraso para asegurar que todos los elementos estén cargados
    setTimeout(() => {
      scrollToBottom();
    }, 200);
  } catch (error) {
    console.error("Error al cargar datos del chat:", error);
    loading.value = false;
    router.push({ name: "chats-list" });
  }
};

// Limpiar cuando el componente se desmonta
onUnmounted(() => {
  // Desconectar socket
  disconnectSocket();

  // Emitir evento de chat no visto
  dispatchChatViewEvent("exited");
});

// Función para marcar los mensajes de un chat como leídos
const markMessagesAsRead = async () => {
  try {
    if (!chatId.value || !currentUserId.value) return;

    // Obtener los datos del chat para saber con quién estamos hablando
    const data = await chatManager.getChatById(chatId.value);
    if (!data || !data.teachers) return;

    // Identificar al otro usuario en el chat
    const otherUserId = data.teachers.find(
      (teacherId) => teacherId !== parseInt(currentUserId.value)
    );

    if (!otherUserId) return;

    // console.log(`Marcando mensajes como leídos para el usuario ${otherUserId}`);

    // Obtener el estado actual de los mensajes no leídos
    const storageKey = `chat_unread_${currentUserId.value}`;
    const unreadData = localStorage.getItem(storageKey);

    if (unreadData) {
      const unreadMessages = JSON.parse(unreadData);

      // Si hay mensajes no leídos de este usuario, marcarlos como leídos
      if (unreadMessages[otherUserId]) {
        // console.log(
        //   `Usuario ${otherUserId} tenía mensajes no leídos, marcando como leídos`
        // );
        delete unreadMessages[otherUserId];

        // Guardar el nuevo estado
        localStorage.setItem(storageKey, JSON.stringify(unreadMessages));

        // Actualizar el contador global
        appStore.updateUnreadMessagesCount();
        // console.log(
        //   "Contador de mensajes no leídos actualizado:",
        //   appStore.getUnreadCount
        // );
      }
    }

    // Asegurarse de que este chat se considera activo
    // (esto es redundante con el evento dispatchChatViewEvent, pero es una garantía adicional)
    const chatActiveEvent = new CustomEvent("chat-view-entered", {
      detail: {
        chatId: chatId.value,
        userId: currentUserId.value,
      },
    });
    window.dispatchEvent(chatActiveEvent);
  } catch (error) {
    console.error("Error al marcar mensajes como leídos:", error);
  }
};

// Conectar al servidor de socket.io
const connectSocket = () => {
  try {
    // Verificar que tenemos los datos necesarios
    if (!currentUserId.value) {
      console.error("No se puede conectar al socket: falta ID de usuario");
      return;
    }

    // Iniciar conexión con socket.io
    socket.value = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Log para debugging
    console.log("Intentando conectar al socket en:", SOCKET_URL);

    // Evento de conexión establecida
    socket.value.on("connect", () => {
      // console.log("Conectado al servidor de chat");

      // Registrar el usuario
      socket.value.emit("register_user", {
        userId: currentUserId.value,
        userName: currentUserName.value,
      });

      // Unirse al chat actual (solo si tenemos un chatId)
      if (chatId.value) {
        // console.log(
        //   `Uniendo al usuario ${currentUserId.value} al chat ${chatId.value}`
        // );
        socket.value.emit("join_chat", {
          chatId: chatId.value,
          userId: currentUserId.value,
          userName: currentUserName.value,
        });
      } else {
        console.warn("No hay chatId disponible para unirse");
      }
    });

    // Evento de desconexión
    socket.value.on("disconnect", () => {
      // console.log("Desconectado del servidor de chat");
    });

    // Registrar todos los manejadores de eventos
    setupSocketEventHandlers();
  } catch (error) {
    console.error("Error al conectar con socket.io:", error);
  }
};

// Configurar los manejadores de eventos del socket
const setupSocketEventHandlers = () => {
  socket.value.on("new_message", (data) => {
    let messageData = null;

    if (
      data.interaction &&
      Array.isArray(data.interaction) &&
      data.interaction.length > 0
    ) {
      const lastInteraction = data.interaction[data.interaction.length - 1];
      messageData = {
        id: lastInteraction._id,
        userId: lastInteraction.teacherId,
        message: lastInteraction.message,
        hasLinks: lastInteraction.hasLinks || false,
        links: lastInteraction.links || [],
        linkPreviews: lastInteraction.linkPreviews || [],
        timestamp: new Date(lastInteraction.date),
      };
    } else if (data.message && data.userId) {
      messageData = {
        id: data.id || Date.now().toString(),
        userId: data.userId,
        message: data.message,
        hasLinks: data.hasLinks || false,
        links: data.links || [],
        linkPreviews: data.linkPreviews || [],
        timestamp: data.timestamp || new Date(),
      };
    } else if (
      data.chatId &&
      data.interaction &&
      !Array.isArray(data.interaction)
    ) {
      const msg = data.interaction;
      messageData = {
        id: msg._id || Date.now().toString(),
        userId: msg.teacherId,
        message: msg.message,
        hasLinks: msg.hasLinks || false,
        links: msg.links || [],
        linkPreviews: msg.linkPreviews || [],
        timestamp: new Date(msg.date) || new Date(),
      };
    }

    // Si no pudimos extraer datos válidos, salir
    if (!messageData) {
      console.error("No se pudo extraer información válida del mensaje:", data);
      return;
    }

    // Si no tenemos información de enlaces pero el mensaje contiene URLs, detectarlas
    if (!messageData.hasLinks) {
      const detectedLinks = detectLinks(messageData.message);
      if (detectedLinks.length > 0) {
        messageData.hasLinks = true;
        messageData.links = detectedLinks;
      }
    }

    // Comprobar si el mensaje tiene formato de enlace con nombre personalizado: "nombre (url)"
    const customLinkRegex = /^(.+?)\s*\((https?:\/\/[^\s)]+)\)$/;
    const customLinkMatch = messageData.message.match(customLinkRegex);

    if (customLinkMatch && customLinkMatch.length === 3) {
      // Si el mensaje tiene el formato "nombre (url)", extraer el nombre y la URL
      const customName = customLinkMatch[1].trim();
      const actualUrl = customLinkMatch[2].trim();

      // Guardar el mensaje original para referencia
      messageData.actualMessage = messageData.message;

      // Actualizar el mensaje para mostrar solo el nombre personalizado
      messageData.message = customName;

      // Asegurarse de que la URL esté en la lista de enlaces
      if (!messageData.links.includes(actualUrl)) {
        messageData.links = [actualUrl];
      }

      // Marcar el mensaje como que tiene enlaces
      messageData.hasLinks = true;

      console.log("Mensaje con enlace personalizado procesado:", {
        original: messageData.actualMessage,
        displayText: messageData.message,
        url: actualUrl,
      });
    }

    // Determinar el nombre del usuario
    const isCurrentUser =
      messageData.userId.toString() === currentUserId.value.toString();
    messageData.userName = isCurrentUser
      ? currentUserName.value
      : `Profesor ${messageData.userId}`;

    // Crear una clave única para este mensaje
    const msgSignature = `${messageData.userId}_${
      messageData.message
    }_${new Date(messageData.timestamp).getTime()}`;

    // Si este mensaje ya fue procesado, ignorarlo
    if (processedMessages.value.has(msgSignature)) {
      // console.log("Mensaje ya procesado anteriormente, ignorando");
      return;
    }

    // Buscar si ya existe un mensaje local similar
    const existingIndex = messages.value.findIndex((msg) => {
      // Si los mensajes tienen el mismo contenido y autor, y están cercanos en tiempo
      const isSameContent =
        msg.message === messageData.message ||
        (msg.actualMessage && msg.actualMessage.includes(messageData.message));
      const isSameAuthor =
        msg.userId.toString() === messageData.userId.toString();
      const timeDiff = Math.abs(
        new Date(msg.timestamp) - new Date(messageData.timestamp)
      );
      const isCloseInTime = timeDiff < 30000; // 30 segundos

      // También comprobar por URLs comunes entre los mensajes
      let hasSameLinks = false;
      if (
        msg.links &&
        messageData.links &&
        msg.links.length > 0 &&
        messageData.links.length > 0
      ) {
        hasSameLinks = msg.links.some((link) =>
          messageData.links.includes(link)
        );
      }

      return (isSameContent || hasSameLinks) && isSameAuthor && isCloseInTime;
    });

    // Marcar el mensaje como procesado
    processedMessages.value.add(msgSignature);

    if (existingIndex === -1) {
      // Si no existe mensaje similar, agregar este nuevo
      // console.log("Mensaje nuevo, agregando:", messageData);
      messages.value.push(messageData);
      scrollToBottom();
    } else {
      // Si ya existe un mensaje similar, actualizar sus propiedades si es necesario
      // console.log("Mensaje similar encontrado en índice:", existingIndex);

      // Si el mensaje existente es local y el nuevo tiene ID del servidor, actualizar
      if (messages.value[existingIndex].local && messageData.id) {
        // console.log("Actualizando mensaje local con datos del servidor");
        messages.value[existingIndex].id = messageData.id;
        messages.value[existingIndex].hasLinks = messageData.hasLinks;
        messages.value[existingIndex].links = messageData.links;
        messages.value[existingIndex].linkPreviews = messageData.linkPreviews;
        messages.value[existingIndex].sending = false;
      }
    }

    // Limitar el tamaño del caché (mantener solo los últimos 100 mensajes)
    if (processedMessages.value.size > 100) {
      // Convertir a array, eliminar los primeros elementos y reconvertir a Set
      const messagesArray = Array.from(processedMessages.value);
      processedMessages.value = new Set(messagesArray.slice(-50)); // Mantener solo los últimos 50
    }
  });

  // Escuchar cuando alguien está escribiendo
  socket.value.on("user_typing", (data) => {
    if (data.userId.toString() !== currentUserId.value.toString()) {
      someoneIsTyping.value = data.isTyping;
      typingUserName.value = data.userName || `Profesor ${data.userId}`;
    }
  });

  // Escuchar cuando un usuario se une al chat
  socket.value.on("user_joined", (data) => {
    // console.log(
    //   `${data.userName || "Profesor " + data.userId} se ha unido al chat`
    // );
  });

  // Escuchar cuando un usuario deja el chat
  socket.value.on("user_left", (data) => {
    // console.log(
    //   `${data.userName || "Profesor " + data.userId} ha salido del chat`
    // );
  });

  // Escuchar errores
  socket.value.on("error", (error) => {
    console.error("Error en socket:", error);
  });

  // Escuchar cuando un mensaje es eliminado
  socket.value.on("message_deleted", (data) => {
    console.log("Recibida notificación de mensaje eliminado:", data);

    // Find the message that was deleted - with more flexible matching
    let messageIndex = -1;

    // First try exact ID match
    messageIndex = messages.value.findIndex((msg) => msg.id === data.messageId);

    // If not found but we have message content from the server, try to match by content
    if (messageIndex === -1 && data.messageContent) {
      messageIndex = messages.value.findIndex(
        (msg) =>
          msg.message === data.messageContent &&
          msg.userId.toString() === data.teacherId
      );

      if (messageIndex !== -1) {
        console.log("Mensaje encontrado por contenido y autor");
      }
    }

    // If still not found and the messageId looks like a MongoDB ObjectID, try to find by temporary IDs
    if (messageIndex === -1 && /^[0-9a-fA-F]{24}$/.test(data.messageId)) {
      const possibleMatches = messages.value.filter((msg) => {
        // Check if it's a temporary ID (likely a timestamp)
        const isTemporary = /^\d{13,}$/.test(msg.id);
        return (
          isTemporary &&
          (!data.teacherId ||
            msg.userId.toString() === data.teacherId.toString())
        );
      });

      if (possibleMatches.length > 0) {
        console.log(
          "Encontrados posibles mensajes con IDs temporales:",
          possibleMatches
        );

        // Try to match by content if available
        if (data.messageContent) {
          const contentMatch = possibleMatches.find(
            (msg) => msg.message === data.messageContent
          );
          if (contentMatch) {
            messageIndex = messages.value.indexOf(contentMatch);
            console.log("Mensaje con ID temporal encontrado por contenido");
          }
        }
      }
    }

    if (messageIndex !== -1) {
      // Mark the message as deleted instead of removing it
      messages.value[messageIndex].deleted = true;

      // If we receive additional data like deletedBy or deletedAt, update it
      if (data.deletedBy) {
        messages.value[messageIndex].deletedBy = data.deletedBy;
      }

      if (data.timestamp) {
        messages.value[messageIndex].deletedAt = new Date(data.timestamp);
      }

      console.log(
        "Mensaje marcado como eliminado:",
        messages.value[messageIndex]
      );
    } else {
      console.warn(
        `No se encontró el mensaje con ID ${data.messageId} para marcar como eliminado`
      );

      // If we still couldn't find it but we have the content, create a new "deleted" message entry
      if (data.messageContent && data.teacherId) {
        console.log(
          "Creando una entrada para el mensaje eliminado que no se encontró localmente"
        );

        // Create a new message object with deleted flag
        const deletedMessage = {
          id: data.messageId,
          userId: data.teacherId,
          userName:
            data.teacherId === currentUserId.value
              ? currentUserName.value
              : `Profesor ${data.teacherId}`,
          message: data.messageContent,
          timestamp: data.messageDate ? new Date(data.messageDate) : new Date(),
          deleted: true,
          deletedBy: data.deletedBy,
          deletedAt: data.timestamp ? new Date(data.timestamp) : new Date(),
        };

        // Add it to the messages array
        messages.value.push(deletedMessage);

        // Sort messages to ensure correct order
        messages.value.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        console.log("Mensaje eliminado añadido a la lista de mensajes");
      }
    }
  });
};

// Desconectar del socket
const disconnectSocket = () => {
  if (socket.value) {
    // Dejar el chat actual antes de desconectar
    if (chatId.value) {
      socket.value.emit("leave_chat", {
        chatId: chatId.value,
        userId: currentUserId.value,
      });
    }

    socket.value.disconnect();
    socket.value = null;
  }
};

// Función para formatear un mensaje con enlaces clickables
const formatMessageWithLinks = (message) => {
  if (!message.links || message.links.length === 0) {
    // Si es un mensaje de pedido, darle formato especial
    if (isOrderMessage(message.message)) {
      return formatOrderMessage(message.message);
    }
    return message.message;
  }

  let formattedMessage = message.message;

  // El resto del código de formatMessageWithLinks sigue igual
  // Manejar el caso especial cuando hay un enlace con @ y texto adicional separado por salto de línea
  if (formattedMessage.includes("@http") && formattedMessage.includes("\n")) {
    // Dividir el mensaje en líneas
    const lines = formattedMessage.split("\n");

    // Formatear cada línea por separado
    const formattedLines = lines.map((line) => {
      // Si la línea contiene un enlace con @, aplicar formato solo al enlace
      if (line.startsWith("@http")) {
        // Extraer la URL (quitar el @ del principio)
        const url = line.substring(1);
        const safeUrl = url.replace(/"/g, "&quot;");

        try {
          // Validar que sea una URL válida
          new URL(safeUrl);
          return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="message-link">@${url}</a>`;
        } catch (e) {
          console.error("Error con URL en formatMessageWithLinks:", e);
          return line; // Si la URL no es válida, mostrar el texto plano
        }
      } else {
        // Si la línea no contiene un enlace con @, devolverla sin cambios
        return line;
      }
    });

    // Unir las líneas formateadas con saltos de línea HTML
    return formattedLines.join("<br>");
  }

  // Si tenemos un mensaje personalizado (con nombre diferente del enlace)
  if (
    (message.actualMessage && message.actualMessage !== message.message) ||
    message.message.match(/^.+?\s*\(https?:\/\/[^\s)]+\)$/) === null
  ) {
    // Si hay un enlace válido, hacemos que todo el texto sea clickeable para el primer enlace
    if (message.links && message.links.length > 0) {
      const safeLink = message.links[0].replace(/"/g, "&quot;");
      try {
        // Validar que sea una URL válida antes de crear el enlace
        new URL(safeLink);
        return `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="message-link">${formattedMessage}</a>`;
      } catch (e) {
        console.error("Error con URL en formatMessageWithLinks:", e);
        return formattedMessage; // Si la URL no es válida, mostrar el texto plano
      }
    }
  } else {
    // Comportamiento tradicional: reemplazar cada enlace con una etiqueta <a>
    message.links.forEach((link) => {
      try {
        const safeLink = link.replace(/"/g, "&quot;");

        // Buscar tanto el enlace normal como con @ delante
        const patterns = [
          link.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // Enlace normal escapado
          "@" + link.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // Enlace con @ escapado
        ];

        patterns.forEach((pattern) => {
          const linkRegex = new RegExp(pattern, "g");
          const replacement = pattern.startsWith("@")
            ? `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="message-link">@${link}</a>`
            : `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="message-link">${link}</a>`;

          formattedMessage = formattedMessage.replace(linkRegex, replacement);
        });
      } catch (e) {
        console.error("Error al formatear enlace:", e);
      }
    });
    return formattedMessage;
  }

  return formattedMessage;
};

// Función para formatear mensajes de pedido
const formatOrderMessage = (message) => {
  if (!message) return "";

  // Reemplazar saltos de línea con <br>
  let formattedMessage = message.replace(/\n/g, "<br>");

  // Resaltar bordes del cuadro con colores
  formattedMessage = formattedMessage.replace(
    /┌─+┐/g,
    '<span class="text-green-400">┌─────────────────────────────┐</span>'
  );
  formattedMessage = formattedMessage.replace(
    /├─+┤/g,
    '<span class="text-green-400">├─────────────────────────────┤</span>'
  );
  formattedMessage = formattedMessage.replace(
    /└─+┘/g,
    '<span class="text-green-400">└─────────────────────────────┘</span>'
  );

  // Resaltar líneas verticales
  formattedMessage = formattedMessage.replace(
    /\│/g,
    '<span class="text-green-400">│</span>'
  );

  // Resaltar título principal
  formattedMessage = formattedMessage.replace(
    /\*COMANDA NOVA\*/g,
    '<span class="font-bold text-green-400">COMANDA NOVA</span>'
  );

  // Resaltar total
  formattedMessage = formattedMessage.replace(
    /\*TOTAL: ([\d.]+) €\*/g,
    '<span class="font-bold text-yellow-400">TOTAL: $1 €</span>'
  );

  // Resaltar sección de preferencias
  formattedMessage = formattedMessage.replace(
    /\*Preferencies:\*/g,
    '<span class="font-bold text-blue-400">Preferencies:</span>'
  );

  // Resaltar marcas de verificación
  formattedMessage = formattedMessage.replace(
    /✓/g,
    '<span class="text-green-400">✓</span>'
  );

  // Resaltar precios
  formattedMessage = formattedMessage.replace(
    /(\d+\.\d+) €/g,
    '<span class="text-yellow-400">$1 €</span>'
  );

  // Resaltar emojis
  formattedMessage = formattedMessage.replace(
    /🛒/g,
    '<span class="text-xl">🛒</span>'
  );
  formattedMessage = formattedMessage.replace(
    /💰/g,
    '<span class="text-xl">💰</span>'
  );
  formattedMessage = formattedMessage.replace(
    /🔖/g,
    '<span class="text-xl">🔖</span>'
  );

  return formattedMessage;
};

// Función para detectar enlaces en un mensaje
const detectLinks = (text) => {
  if (!text) return [];

  // Buscar URLs explícitas
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const explicitLinks = text.match(urlRegex) || [];

  // Buscar URLs con formato @http:// o @https://
  const atUrlRegex = /@(https?:\/\/[^\s]+)/g;
  const atLinks = [];
  let match;

  while ((match = atUrlRegex.exec(text)) !== null) {
    if (match[1]) {
      atLinks.push(match[1]);
    }
  }

  // Buscar también URLs en formato "texto (https://ejemplo.com)"
  const urlWithTextRegex = /\(https?:\/\/[^\s)]+\)/g;
  const linksInParentheses = text.match(urlWithTextRegex) || [];

  // Procesar los enlaces en paréntesis para extraer solo la URL
  const extractedLinks = linksInParentheses
    .map((link) => {
      // Extraer solo la URL entre paréntesis
      const matches = link.match(/\((https?:\/\/[^\s)]+)\)/);
      return matches ? matches[1] : null;
    })
    .filter((link) => link !== null);

  // Combinar todos los conjuntos de enlaces y eliminar duplicados
  const allLinks = [...explicitLinks, ...atLinks, ...extractedLinks];
  return [...new Set(allLinks)]; // Eliminar duplicados
};

// Función original para enviar mensajes
const originalSendMessage = async () => {
  if (!currentUserId.value) {
    console.error("No se puede enviar mensaje: usuario no autenticado");
    return;
  }

  // Solo enviar si hay un enlace activo o un mensaje de texto
  if ((activeLink.value || newMessage.value.trim()) && chatId.value) {
    try {
      // Crear el mensaje completo: enlace + texto (si ambos existen)
      let fullMessage = "";

      if (activeLink.value) {
        fullMessage = `@${activeLink.value}`;

        if (newMessage.value.trim()) {
          fullMessage += `\n${newMessage.value.trim()}`;
        }
      } else {
        fullMessage = newMessage.value.trim();
      }

      const tempId = Date.now().toString();

      // Detectar enlaces en el mensaje
      const links = activeLink.value
        ? [activeLink.value]
        : detectLinks(fullMessage);
      const hasLinks = links.length > 0 || activeLink.value !== null;

      // Limpiar los campos de entrada
      newMessage.value = "";
      const linkToSend = activeLink.value;
      activeLink.value = null;

      // Agregar el mensaje localmente para que aparezca inmediatamente
      const localMessage = {
        id: tempId,
        userId: currentUserId.value,
        userName: currentUserName.value,
        message: fullMessage,
        hasLinks: hasLinks,
        links: links,
        linkPreviews: [],
        timestamp: new Date(),
        sending: true,
        local: true,
      };

      // Si había un enlace activo, agregar previsualización básica
      if (linkToSend) {
        localMessage.linkPreviews = [
          {
            url: linkToSend,
            title: extractDomain(linkToSend),
            description: "",
            siteName: extractDomain(linkToSend),
          },
        ];
      }

      // Agregar el mensaje a la lista
      messages.value.push(localMessage);

      // Hacer scroll para mostrar el nuevo mensaje
      scrollToBottom();

      // Enviar el mensaje a través del API
      const result = await chatManager.sendMessage(
        chatId.value,
        currentUserId.value,
        fullMessage // Enviamos el mensaje completo al servidor
      );

      // Actualizar el mensaje local con el ID real
      const messageIndex = messages.value.findIndex((m) => m.id === tempId);
      if (messageIndex !== -1) {
        // Si el último mensaje recibido tiene el interaction array, actualizar
        if (result.interaction && result.interaction.length > 0) {
          const newMsg = result.interaction[result.interaction.length - 1];
          messages.value[messageIndex] = {
            ...messages.value[messageIndex],
            id: newMsg._id,
            hasLinks: newMsg.hasLinks || hasLinks,
            links: newMsg.links || links,
            linkPreviews: newMsg.linkPreviews || localMessage.linkPreviews,
            sending: false,
            local: true, // Mantener la marca para evitar duplicación
          };
        } else {
          // Solo marcar como enviado si no tenemos el ID real
          messages.value[messageIndex].sending = false;
        }
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      // Marcar el mensaje como fallido
      const failedMessageIndex = messages.value.findIndex((m) => m.sending);
      if (failedMessageIndex !== -1) {
        messages.value[failedMessageIndex].failed = true;
        messages.value[failedMessageIndex].sending = false;
      }
    }
  }
};

// Nueva función de envío de mensaje que usa la original y limpia el carrito
const sendMessage = async () => {
  // Verificar si hay un pedido de cantina para enviar
  if (
    isChatWithCanteen.value &&
    hasCantinaItems.value &&
    !newMessage.value.trim()
  ) {
    // Create the complete message with the order
    let fullMessage = generateCantinaOrderMessage();

    // Enviar el mensaje directamente sin colocarlo en el input
    try {
      const tempId = Date.now().toString();

      // Detectar enlaces en el mensaje
      const links = detectLinks(fullMessage);
      const hasLinks = links.length > 0;

      // Agregar el mensaje localmente para que aparezca inmediatamente
      const localMessage = {
        id: tempId,
        userId: currentUserId.value,
        userName: currentUserName.value,
        message: fullMessage,
        hasLinks: hasLinks,
        links: links,
        linkPreviews: [],
        timestamp: new Date(),
        sending: true,
        local: true,
      };

      // Agregar el mensaje a la lista
      messages.value.push(localMessage);

      // Hacer scroll para mostrar el nuevo mensaje
      scrollToBottom();

      // Enviar el mensaje a través del API
      const result = await chatManager.sendMessage(
        chatId.value,
        currentUserId.value,
        fullMessage
      );

      // Actualizar el mensaje local con el ID real
      const messageIndex = messages.value.findIndex((m) => m.id === tempId);
      if (messageIndex !== -1) {
        // Si el último mensaje recibido tiene el interaction array, actualizar
        if (result.interaction && result.interaction.length > 0) {
          const newMsg = result.interaction[result.interaction.length - 1];
          messages.value[messageIndex] = {
            ...messages.value[messageIndex],
            id: newMsg._id,
            hasLinks: newMsg.hasLinks || hasLinks,
            links: newMsg.links || links,
            linkPreviews: newMsg.linkPreviews || [],
            sending: false,
            local: true, // Mantener la marca para evitar duplicación
          };
        } else {
          // Solo marcar como enviado si no tenemos el ID real
          messages.value[messageIndex].sending = false;
        }
      }

      // Limpiar el carrito después de enviar
      clearCantinaOrder();

      // Limpiar preferencias seleccionadas
      selectedOrderOptions.value = [];
    } catch (error) {
      console.error("Error al enviar pedido de cantina:", error);
      // Mostrar error al usuario
    }
  } else {
    // Si hay texto en el input o no hay productos en el carrito, usar la función original
    await originalSendMessage();
  }
};

// Manejar evento de escritura
const handleTyping = () => {
  if (!isTyping.value && chatId.value) {
    isTyping.value = true;
    socket.value.emit("typing", {
      chatId: chatId.value,
      userId: currentUserId.value,
      userName: currentUserName.value,
      isTyping: true,
    });
  }

  // Limpiar timeout anterior
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  // Establecer nuevo timeout
  typingTimeout.value = setTimeout(() => {
    isTyping.value = false;
    if (chatId.value) {
      socket.value.emit("typing", {
        chatId: chatId.value,
        userId: currentUserId.value,
        userName: currentUserName.value,
        isTyping: false,
      });
    }
  }, 1000);

  // Ajustar altura del textarea
  adjustTextareaHeight();
};

// Función para ajustar la altura del textarea según el contenido
const adjustTextareaHeight = () => {
  if (messageInput.value) {
    messageInput.value.style.height = "auto";
    messageInput.value.style.height = messageInput.value.scrollHeight + "px";
  }
};

// Función para manejar Ctrl+Enter (insertar salto de línea)
const handleCtrlEnter = (event) => {
  // Insertar un salto de línea en la posición del cursor
  const cursorPosition = event.target.selectionStart;
  const textBefore = newMessage.value.substring(0, cursorPosition);
  const textAfter = newMessage.value.substring(cursorPosition);

  newMessage.value = textBefore + "\n" + textAfter;

  // Restaurar la posición del cursor después del salto de línea
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.selectionStart = cursorPosition + 1;
      messageInput.value.selectionEnd = cursorPosition + 1;
      adjustTextareaHeight();
    }
  });
};

// Función para manejar la tecla Enter (enviar mensaje)
const handleEnterKey = (event) => {
  // Si no se presiona Ctrl, enviar el mensaje
  if (!event.ctrlKey) {
    event.preventDefault();
    sendMessage();
  }
};

// Función para eliminar el enlace activo
const removeActiveLink = () => {
  activeLink.value = null;
};

// Función para resaltar enlaces en el campo de entrada
const messageInputWrapper = ref(null);
const messageInput = ref(null);

const highlightLinksInInput = () => {
  // Aplicar estilos al input cuando contiene enlaces
  if (messageInput.value) {
    const text = newMessage.value;
    const hasLinks = text.includes("@http://") || text.includes("@https://");

    if (hasLinks) {
      messageInput.value.classList.add("has-links");
    } else {
      messageInput.value.classList.remove("has-links");
    }
  }
};

// Formatear fecha para mostrar
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString();
};

// Scroll al final de los mensajes
const scrollToBottom = () => {
  nextTick(() => {
    // Utilizar el elemento de referencia al final de los mensajes para hacer scroll
    if (endOfMessages.value) {
      endOfMessages.value.scrollIntoView({ behavior: "smooth" });
    }
    // Método alternativo utilizando el contenedor de mensajes
    else if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Reintentar enviar un mensaje fallido
const retryMessage = async (message, index) => {
  if (message.failed && chatId.value) {
    try {
      messages.value[index].failed = false;
      messages.value[index].sending = true;

      if (!message.hasLinks) {
        const links = detectLinks(message.message);
        message.hasLinks = links.length > 0;
        message.links = links;
        message.linkPreviews = [];
      }

      const result = await chatManager.sendMessage(
        chatId.value,
        message.userId,
        message.message
      );

      if (result.interaction && result.interaction.length > 0) {
        const newMsg = result.interaction[result.interaction.length - 1];
        messages.value[index] = {
          ...messages.value[index],
          id: newMsg._id,
          hasLinks: newMsg.hasLinks || message.hasLinks,
          links: newMsg.links || message.links,
          linkPreviews: newMsg.linkPreviews || [],
          sending: false,
          failed: false,
          local: true,
        };
      } else {
        messages.value[index].sending = false;
        messages.value[index].failed = false;
      }
    } catch (error) {
      console.error("Error al reenviar missatge:", error);
      messages.value[index].failed = true;
      messages.value[index].sending = false;
    }
  }
};

// Función para emitir eventos de cambio de vista de chat
const dispatchChatViewEvent = (action) => {
  if (!chatId.value) return;

  const eventName =
    action === "entered" ? "chat-view-entered" : "chat-view-exited";

  // Usar CustomEvent para poder enviar datos adicionales
  const event = new CustomEvent(eventName, {
    detail: {
      chatId: chatId.value,
      userId: currentUserId.value,
      timestamp: new Date(),
    },
  });

  // console.log(`Emitiendo evento ${eventName} para chat ${chatId.value}`);
  window.dispatchEvent(event);
};

// Función para eliminar un mensaje
const deleteMessage = async (message) => {
  if (!message.id || !chatId.value) return;

  // Store the message to delete and show the confirmation modal
  messageToDelete.value = message;
  showAlert(
    "Confirmar eliminació",
    "Estàs segur que vols eliminar aquest missatge?"
  );

  // The actual deletion will be handled by confirmDeleteMessage
};

// Add a new function to handle the actual message deletion after confirmation
const confirmDeleteMessage = async () => {
  if (!messageToDelete.value || !messageToDelete.value.id || !chatId.value) {
    showAlertModal.value = false;
    return;
  }

  try {
    const message = messageToDelete.value;

    // Mark the message as deleted locally first for immediate feedback
    const messageIndex = messages.value.findIndex(
      (msg) => msg.id === message.id
    );

    if (messageIndex !== -1) {
      messages.value[messageIndex].deleted = true;
    }

    // Hide the confirmation modal
    showAlertModal.value = false;

    // Check if the message ID is a temporary ID (timestamp) vs MongoDB ObjectID
    const isTemporaryId = /^\d{13,}$/.test(message.id);

    // If it's a temporary ID, we need to get the real message ID from the server first
    if (isTemporaryId) {
      console.log(
        `Detectado ID temporal: ${message.id}. Buscando mensaje en el servidor...`
      );
      try {
        // Get the current chat data to find the real message ID
        const chatData = await chatManager.getChatById(chatId.value);
        if (
          chatData &&
          chatData.interaction &&
          Array.isArray(chatData.interaction)
        ) {
          // Try to find the message by comparing content and timestamp
          const serverMsg = chatData.interaction.find((msg) => {
            // Compare message content
            const contentMatch = msg.message === message.message;
            // Compare timestamps (allowing for some time difference)
            const msgTime = new Date(msg.date).getTime();
            const localTime = new Date(message.timestamp).getTime();
            const timeMatch = Math.abs(msgTime - localTime) < 60000; // Within 1 minute

            return contentMatch && timeMatch;
          });

          if (serverMsg && serverMsg._id) {
            console.log(
              `Encontrado ID real: ${serverMsg._id} para mensaje temporal: ${message.id}`
            );
            message.id = serverMsg._id; // Update the message ID to the real one
          } else {
            console.error("No se encontró el mensaje en el servidor");
            throw new Error("No se encontró el mensaje en el servidor");
          }
        }
      } catch (err) {
        console.error("Error al buscar mensaje real:", err);
        // Continue with deletion attempt anyway
      }
    }

    // Always use the API to delete the message for consistency
    // Socket.io will handle the propagation to other clients
    await chatManager.deleteMessage(chatId.value, message.id);

    console.log(`Mensaje ${message.id} eliminado exitosamente`);
    messageToDelete.value = null;
  } catch (error) {
    console.error("Error al eliminar mensaje:", error);
    showAlert(
      "Error",
      "No s'ha pogut eliminar el missatge. Torna-ho a provar."
    );

    // Revert the deleted state if there was an error
    const messageIndex = messages.value.findIndex(
      (msg) => msg.id === messageToDelete.value.id
    );
    if (messageIndex !== -1) {
      messages.value[messageIndex].deleted = false;
    }

    messageToDelete.value = null;
  }
};

// Función para truncar texto largo
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Función para extraer el dominio de una URL
const extractDomain = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch (e) {
    return url;
  }
};

// Función para abrir un enlace en una nueva pestaña
const openLink = (url) => {
  try {
    // Nos aseguramos de que la URL esté bien formada
    let validUrl = url;

    // Si no comienza con http:// o https://, añadir https://
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl;
    }

    // Intentar crear un objeto URL para validar (lanzará error si es inválida)
    new URL(validUrl);

    // Abrir la URL en una nueva pestaña
    window.open(validUrl, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Error al abrir URL:", error, "URL:", url);
    // Mostrar mensaje de error al usuario
    showAlert(
      "Error d'enllaç",
      "No s'ha pogut obrir l'enllaç. URL incorrecta o inaccessible."
    );
  }
};

// Función para abrir/cerrar el selector de emojis
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
  // Cerrar el popup de enlaces si está abierto
  if (showEmojiPicker.value) {
    showLinkPopup.value = false;
  }
};

// Función para añadir un emoji al mensaje
const addEmoji = (emoji) => {
  // Obtener la posición actual del cursor
  const cursorPosition = messageInput.value.selectionStart;

  // Insertar el emoji en la posición del cursor
  const textBefore = newMessage.value.substring(0, cursorPosition);
  const textAfter = newMessage.value.substring(cursorPosition);

  // Añadir el emoji
  newMessage.value = textBefore + emoji + textAfter;

  // Restaurar el cursor después del emoji
  nextTick(() => {
    if (messageInput.value) {
      const newPosition = cursorPosition + emoji.length;
      messageInput.value.selectionStart = newPosition;
      messageInput.value.selectionEnd = newPosition;
      messageInput.value.focus();
    }

    // Cerrar el selector de emojis
    showEmojiPicker.value = false;
  });
};

// Función para abrir el popup de inserción de enlace
const openLinkPopup = () => {
  showLinkPopup.value = true;
  // Cerrar el selector de emojis si está abierto
  showEmojiPicker.value = false;
};

// Función para insertar un enlace
const insertLink = async () => {
  if (!linkUrl.value) {
    // Mostrar mensaje de error si no hay URL
    showAlert("URL buida", "Si us plau, introdueix una URL vàlida");
    return;
  }

  try {
    // Normalizar y validar la URL
    let normalizedUrl = linkUrl.value.trim();

    // Si no comienza con http:// o https://, añadir https://
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    // Validar la URL usando el constructor URL (lanzará error si es inválida)
    try {
      new URL(normalizedUrl);
    } catch (e) {
      showAlert(
        "URL no vàlida",
        "La URL introduïda no és vàlida. Si us plau, verifica el format."
      );
      console.error("URL inválida:", normalizedUrl, e);
      return;
    }

    // Establecer el enlace activo
    activeLink.value = normalizedUrl;

    // Cerrar el popup
    showLinkPopup.value = false;
    linkUrl.value = "";

    // Enfocar el campo de mensaje
    setTimeout(() => {
      if (messageInput.value) {
        messageInput.value.focus();
      }
    }, 100);
  } catch (error) {
    console.error("Error al insertar enlace:", error);
    showAlert("Error", "No s'ha pogut inserir l'enllaç. Torna-ho a provar.");
  }
};

// And add the tooltip function
const getDeletedMessageTooltip = (message) => {
  let tooltip = "Missatge eliminat";

  if (message.deletedAt) {
    const date = formatDate(message.deletedAt);
    tooltip += ` el ${date}`;
  }

  if (message.deletedBy) {
    tooltip += ` por ${
      message.deletedBy === currentUserId.value ? "ti" : "otro usuario"
    }`;
  }

  return tooltip;
};

// Función para verificar si un mensaje es un pedido de cantina
const isOrderMessage = (message) => {
  return (
    message &&
    (message.includes("*Nuevo Pedido*") ||
      message.includes("*Nou Pedido*") ||
      message.includes("🛒") ||
      (message.includes("Total:") && message.includes("€")))
  );
};

const showCantinaInfo = ref(false);

// Opciones rápidas para pedidos de cantina
const quickOrderOptions = ref([
  "Sense tomàquet",
  "Amb tomàquet",
  "Fred",
  "Calent",
]);
const selectedOrderOptions = ref([]);

// Función para alternar opciones de pedido
const toggleOrderOption = (option) => {
  const index = selectedOrderOptions.value.indexOf(option);
  if (index === -1) {
    // Si no está seleccionada, añadirla
    selectedOrderOptions.value.push(option);
  } else {
    // Si ya está seleccionada, quitarla
    selectedOrderOptions.value.splice(index, 1);
  }
};

// Observar cambios en los mensajes para hacer scroll
watch(messages, () => {
  if (messages.value.length > 0) {
    scrollToBottom();
  }
});

// Variables para el modal de alertas
const showAlertModal = ref(false);
const alertTitle = ref("");
const alertMessage = ref("");

// Función para mostrar una alerta
const showAlert = (title, message) => {
  alertTitle.value = title;
  alertMessage.value = message;
  showAlertModal.value = true;
};

const messageToDelete = ref(null); // Variable para el mensaje a eliminar
</script>

<style scoped>
/* Mantener estilos de enlaces de mensaje existentes */
:deep(.message-link) {
  @apply text-blue-400 underline cursor-pointer break-all transition-colors duration-200;
}

:deep(.message-link:hover) {
  @apply text-blue-300;
}

:deep(.message-link[href^="http"]:not(.no-style)) {
  @apply bg-blue-500/10 border border-blue-500/20 rounded px-1.5 py-0.5 mx-0.5 no-underline inline-block transition-all duration-200;
}

:deep(.message-link[href^="http"]:hover:not(.no-style)) {
  @apply bg-blue-500/20 border-blue-500/30;
}

/* Message link styling for own messages */
.ml-auto :deep(.message-link) {
  @apply text-white underline font-medium;
}

.ml-auto :deep(.message-link[href^="http"]:not(.no-style)) {
  @apply bg-white/20 border border-white/30 no-underline;
}

.ml-auto :deep(.message-link[href^="http"]:hover:not(.no-style)) {
  @apply bg-white/30 border-white/40;
}

.ml-auto :deep(.message-link:hover) {
  @apply text-gray-100;
}

/* Estilos para animaciones de loading */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  border: 4px solid rgba(124, 58, 237, 0.1);
  border-left-color: rgba(124, 58, 237, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Animaciones personalizadas */
@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

/* Estilos para los mensajes */
.chat-messages > div,
div[class*="max-w-"] {
  padding: 1rem;
  border-radius: 0.75rem;
  word-break: break-word;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Scrollbar personalizado */
.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: rgba(124, 58, 237, 0.5) rgba(30, 41, 59, 0.5);
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(124, 58, 237, 0.5);
  border-radius: 10px;
}

/* Estilo para mensajes de pedido */
.order-message {
  border-left: 4px solid rgba(34, 197, 94, 0.5);
  background-color: rgba(22, 33, 22, 0.6) !important;
}

/* Estilos para los mensajes de cantina formateados */
:deep(.text-green-400) {
  color: rgb(74, 222, 128);
}

:deep(.text-yellow-400) {
  color: rgb(250, 204, 21);
}

:deep(.text-blue-400) {
  color: rgb(96, 165, 250);
}

:deep(.font-bold) {
  font-weight: 700;
}

:deep(.text-xl) {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

/* Estilos para botones de acción */
.response-btn,
button.bg-gradient-to-r {
  transition: all 0.2s;
}

button.bg-gradient-to-r:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Estilo para los mensajes de cantina */
.message.order-message {
  border-left: 4px solid rgba(34, 197, 94, 0.5);
  background-color: rgba(22, 33, 22, 0.6) !important;
}
</style>
