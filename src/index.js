import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.css";

import logo from "./img/logo.png";
import botIcon from "./img/bot.png";
import close from "./img/close.png";

const serverLink = "https://sam-zam-server.herokuapp.com";

const standart = new Set([
  "Назад",
  "Предыдущие вопросы",
  "Вернуться на главный экран",
  "Ещё вопросы",
]);

/**
 * Конструктор объекта сообщения
 *
 * @constructor
 *
 * @param {string} text - текст сообщения (обязательный параметр)
 * @param {string} sender - отправитель = "bot" или "user" (обязательный параметр)
 * @param {boolean} appear - флаг, контролирующий появление вариантов ответов/вопросов,
 * которые предлагает бот
 * @param {array} array - массив опций (вариантов ответов/вопросов, которые предлагает бот)
 * @param {string} link - ссылка на скачивание договора
 */
class MessageObject {
  constructor(text, sender, appear = false, array = [], link = null) {
    this.text = text;
    this.sender = "_" + sender;
    this.options = { appear: appear, array: array };
    this.link = link;
  }
}

/**
 * Компонент опции (вариант ответа/вопроса, который предлагает бот)
 * @component
 */
class Option extends React.Component {
  render() {
    return (
      <div
        className={"option" + (standart.has(this.props.text) ? " _yellow" : "")}
        onClick={(e) => {
          this.props.onClick(e);
        }}
      >
        {this.props.text}
      </div>
    );
  }
}

/**
 * Компонент сообщения (может содержать компонент опции)
 * @component
 */
class Message extends React.Component {
  render() {
    const options = this.props.options;

    let element = null;
    if (options.appear) {
      element = (
        <div className="option-container">
          {options.array.map((text, index) => (
            <Option
              key={index}
              text={text[0]}
              onClick={(e) => {
                this.props.onClick(e, text[1], index);
              }}
            />
          ))}
        </div>
      );
    }

    let link = null;
    if (this.props.link) {
      link = (
        <a href={this.props.link} className="message__link" download>
          Скачать
        </a>
      );
    }

    return (
      <div className={"message-container " + this.props.position}>
        <div className="message">
          <div dangerouslySetInnerHTML={{ __html: this.props.text }}></div>
          {link}
        </div>
        {element}
      </div>
    );
  }
}

/**
 * Компонент чата (содержит компоненты сообщений)
 * @component
 */
class Chat extends React.Component {
  /**
   * Конструктор компонента чата. Компонент хранит массив отображаемых сообщений.
   * @constructor
   */
  constructor(props) {
    super(props);
    const startBlock = new MessageObject(
      "Добро пожаловать! Давайте я покажу вам, с чем могу помочь:",
      "bot",
      true,
      [
        ["Пройти тест на самозанятость", "/selfTest?id=" + props.id],
        ["Получить комплект докуметов", "/documents?id=" + props.id],
        ["Узнать подробнее про самозанятых", "/questions"],
      ]
    );

    const continueBlock = JSON.parse(JSON.stringify(startBlock));
    continueBlock.text = "Что Вас интересует?";

    this.state = {
      messages: [JSON.parse(JSON.stringify(startBlock))],
      id: props.id,
      continueBlock: continueBlock,
    };
  }

  render() {
    const messages = this.state.messages;

    let handler = this.debounce(this.handleClick.bind(this));

    return (
      <div className="chat-wrapper">
        {messages.map((m, index) => (
          <Message
            key={index}
            text={m.text}
            position={m.sender}
            options={m.options}
            link={m.link}
            onClick={handler}
          />
        ))}
      </div>
    );
  }

  /**
   * Отправка и обработка GET-запроса серверу в тесте на самозанятость
   * @method
   * @param {array} messages - массив сообщений в чате
   * @param {string} link - ссылка (относительный путь) для выполнения запроса
   */
  async fetchSETest(messages, next) {
    let newQuestion = "Извините, данная опция временно недоступна";
    const id = this.state.id;

    try {
      if (typeof next === "string") {
        let response = await fetch(serverLink + next);
        if (response.ok) {
          newQuestion = await response.json();
          if (newQuestion.errorID) {
            throw newQuestion;
          }
          if (newQuestion.text === "") {
            messages.push(JSON.parse(JSON.stringify(this.state.continueBlock)));
            return;
          }
          let yes = isFinite(newQuestion.next[0])
            ? "/selfTest/next?" +
              new URLSearchParams({ id: id, number: newQuestion.next[0] })
            : newQuestion.next[0];
          let no = isFinite(newQuestion.next[1])
            ? "/selfTest/next?" +
              new URLSearchParams({ id: id, number: newQuestion.next[1] })
            : newQuestion.next[1];
          let prev = "/selfTest/prev?" + new URLSearchParams({ id: id });
          messages.push(
            new MessageObject(newQuestion.text, "bot", true, [
              ["Да", yes],
              ["Нет", no],
              ["Назад", prev],
            ])
          );
        } else {
          messages.push(new MessageObject(newQuestion, "bot  _red"));
          messages.push(JSON.parse(JSON.stringify(this.state.continueBlock)));
        }
      } else {
        let style =
          next.result || next.result === undefined ? "_green" : "_red";
        messages.push(
          new MessageObject(next.answer, "bot " + style, true, [
            ["Далее", "continue"],
          ])
        );
      }
    } catch (e) {
      if (e.errorID) {
        messages.push(
          new MessageObject(
            "Время сессии истекло. Пожалуйста, обновите страницу.",
            "bot _red"
          )
        );
      } else {
        messages.push(
          new MessageObject("Нет подключения к серверу", "bot _red")
        );
        messages.push(JSON.parse(JSON.stringify(this.state.continueBlock)));
      }
    }
  }

  /**
   * Отправка и обработка GET-запроса серверу в тесте на подбор комплекта документов
   * @method
   * @param {array} messages - массив сообщений в чате
   * @param {string} link - ссылка (относительный путь) для выполнения запроса
   * @param {int} index - индекс варианта ответа (если равен -1, то пользователь возвращается на стартовый блок))
   */
  async fetchDocTest(messages, next) {
    const id = this.state.id;
    let newQuestion = { text: "Извините, данная опция временно недоступна" };
    try {
      let response = await fetch(serverLink + next); // + "?" + new URLSearchParams({ answer: index, number: n }));
      if (response.ok) {
        if (newQuestion.errorID) {
          throw newQuestion;
        }
        newQuestion = await response.json();
        if (newQuestion.text.length !== 0) {
          let options = newQuestion.options.map((option, index) => [
            option[0],
            "/documents/next?" +
              new URLSearchParams({ id: id, answer: index, number: option[1] }),
          ]);
          options.push([
            "Назад",
            "/documents/prev?" + new URLSearchParams({ id: id }),
          ]);
          messages.push(
            new MessageObject(newQuestion.text, "bot", true, options)
          );
        } else {
          if (newQuestion.link) {
            messages.push(
              new MessageObject(
                "Ваш договор:",
                "bot _green",
                true,
                [["Далее", "continue"]],
                "./documents" + newQuestion.link
              )
            );
          } else {
            if (typeof newQuestion.link === "undefined") {
              messages.push(
                JSON.parse(JSON.stringify(this.state.continueBlock))
              );
            } else {
              messages.push(
                new MessageObject(
                  "Данная ветка пока в разработке",
                  "bot _red",
                  true,
                  [["Далее", "continue"]]
                )
              );
            }
          }
        }
      } else {
        messages.push(new MessageObject(newQuestion.text, "bot  _red"));
        messages.push(JSON.parse(JSON.stringify(this.state.continueBlock)));
      }
    } catch (e) {
      if (e.errorID) {
        messages.push(
          new MessageObject(
            "Время сессии истекло. Пожалуйста, обновите страницу.",
            "bot _red"
          )
        );
      } else {
        messages.push(
          new MessageObject("Нет подключения к серверу", "bot  _red")
        );
        messages.push(JSON.parse(JSON.stringify(this.state.continueBlock)));
      }
    }
  }

  /**
   * Отправка и обработка GET-запроса серверу для получения вопросов и ответов по самозанятым
   * @method
   * @param {array} messages - массив сообщений в чате
   * @param {any} next - ссылка (относительный путь) для выполнения запроса (строка) или объект, содержащий ответ на вопрос и данные
   * для последующего отображения вопросов
   */

  async fetchQuestions(messages, next) {
    let newQuestion = { text: "Извините, данная опция временно недоступна" };
    try {
      if (next.answer) {
        messages.push(
          new MessageObject(next.answer, "bot _green", true, [
            [
              "Далее",
              "/questions/next?" +
                new URLSearchParams({
                  category: next.category,
                  part: next.part,
                }),
            ],
          ])
        );
      } else {
        let response = await fetch(serverLink + next);
        if (response.ok) {
          newQuestion = await response.json();
          let options = newQuestion.options.map((option) => [
            option[0],
            isFinite(option[1])
              ? "/questions/next?" +
                new URLSearchParams({
                  category: option[0],
                  part: 0,
                })
              : {
                  category: newQuestion.text,
                  part: 0,
                  answer: option[1],
                },
          ]);
          if (newQuestion.more) {
            options.push([
              "Ещё вопросы",
              "/questions/next?" +
                new URLSearchParams({
                  category: newQuestion.text,
                  part: newQuestion.part,
                }),
            ]);
          }
          if (newQuestion.less) {
            options.push([
              "Предыдущие вопросы",
              "/questions/prev?" +
                new URLSearchParams({
                  category: newQuestion.text,
                  part: newQuestion.part,
                }),
            ]);
          }
          options.push(["Вернуться на главный экран", "continue"]);
          messages.push(
            new MessageObject(newQuestion.text, "bot", true, options)
          );
        } else {
          messages.push(new MessageObject(newQuestion.text, "bot _red"));
          messages.push(JSON.parse(JSON.stringify(this.state.continueBlock)));
        }
      }
    } catch (e) {
      messages.push(new MessageObject("Нет подключения к серверу", "bot _red"));
      messages.push(JSON.parse(JSON.stringify(this.state.continueBlock)));
    }
  }

  /**
   * Декоратор функции. игнорирует повтореные вызовы функции-аргумента в ечение 3 секунд.
   * @method
   * @param {object} func - функция, которую нужно декорировать
   */
  debounce(func) {
    let callFlag = true;
    return function (...args) {
      if (!callFlag) {
        return;
      }
      func(...args);
      callFlag = false;
      setTimeout(() => {
        callFlag = true;
      }, 3000);
    };
  }
  /**
   * Обработчик события клика (используется при клике на опции(варианты ответов/вопросов, которые предлагает чат-бот))
   * @method
   * @param {object} e - объект события
   * @param {string} link - ссылка (относительный путь) для выполнения запроса
   * @param {int} index - индекс варианта ответа (если равен -1, то пользователь возвращается на стартовый блок))
   */
  async handleClick(e, link, index) {
    const messages = this.state.messages;

    let messageOptions = messages[messages.length - 1].options;

    messageOptions.appear = false;
    messageOptions.array = [];

    messages.push(new MessageObject(e.target.textContent, "user"));
    if (
      (typeof link === "object" && typeof link.result !== "undefined") ||
      (typeof link === "string" && link.includes("selfTest"))
    ) {
      await this.fetchSETest(messages, link);
    }
    if (link === "continue") {
      messages.push(JSON.parse(JSON.stringify(this.state.continueBlock)));
    }
    if (
      (typeof link === "string" && link.includes("questions")) ||
      (typeof link === "object" && link.category)
    ) {
      await this.fetchQuestions(messages, link);
    }
    if (typeof link === "string" && link.includes("documents")) {
      await this.fetchDocTest(messages, link, index);
    }

    this.setState({ messages: messages });

    setTimeout(() => {
      let element = document.querySelector(".chat-wrapper");
      element.scrollTop = element.scrollHeight;
    }, 0);
  }
}

/**
 * Компонент чат-бота (содержит компонент чата)
 * @component
 */
class ChatBot extends React.Component {
  render() {
    let id;
    try {
      (async () => {
        id = +new Date();
        let response = await fetch(serverLink + "/init?id=" + id);
        if (response.ok) {
        } else {
          alert("error");
          console.log("error");
        }
      })();
    } catch (err) {
      console.log("error");
    }
    return (
      <div className="chatbot">
        <img className="chatbot__icon" src={botIcon} alt="chat-bot-icon" />
        <Chat id={id} />
      </div>
    );
  }
}

/**
 * Компонент футера
 * @component
 */
class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appear: false,
      text: "",
    };
  }
  render() {
    let textBlock = null;
    if (this.state.appear) {
      textBlock = (
        <div className="info-block">
          <div className="info-block__text">
            <img className="info-block__close-icon" src={close} alt="close" />
            {this.state.text}
          </div>
        </div>
      );
    }

    return (
      <footer
        className="footer"
        onClick={(e) => {
          this.handleClick(e);
        }}
      >
        {textBlock}
        <div className="footer__content">О нас</div>
      </footer>
    );
  }

  /**
   * Обработчик события клика (обрабатывает появление и закрытие информационного окна)
   * @method
   * @param {object} e - объект события
   */
  async handleClick(e) {
    if (!this.state.appear) {
      let response = await fetch(serverLink + "/aboutUs");
      let text = "";
      if (response.ok) {
        text = (await response.json()).text;
      } else {
        text = "Функция временно недоступна";
      }
      this.setState({ appear: true, text: text });
    } else {
      if (e.target.className !== "info-block__text") {
        this.setState({ appear: false, text: "" });
      }
    }
  }
}

/**
 * Компонент страницы (содержит компонент чат-бота)
 * @component
 */
class Page extends React.Component {
  render() {
    return (
      <div className="page">
        <main className="page__main">
          <div className="logo">
            <img className="logo__img" src={logo} alt="logo" />
          </div>
          <ChatBot />
        </main>
        <Footer />
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Page />);
