# SP.Starter

**Шаблон проекта для быстрого старта. Работает на Node 16+.**

## Старт проекта

#### 1. Установить зависимости:

с помощью yarn (быстрее)

```
yarn install
```

или с помощью npm (медленнее):

```
npm install
```

#### 2. Запустить Gulp для разработки:

```
npm start
```

#### 3. Открыть следующий URL - [`http://localhost:9000/`](http://localhost:9000/).

## Команды

#### Запустить проект для разработки:

```
npm start
```

#### Собрать проект для продакшена:

```
npm run build
```

#### Создание архива `build.zip` для продакшена:

```
npm run zip
```

## Структура проекта

Не обязательно разделять интерфейс на отдельные части и компоненты, но это эффективный подход по многим причинам.

Создавайте компоненты по крайней мере для тех частей интерфейса, которые появляются в нескольких местах вашего проекта. Это могут быть кнопки, общие разделы страницы, виджеты, слайдеры и так далее.

Этот стартер позволяет хранить разметку, стили и код JavaScript для компонента в одной папке, а затем использовать их в нескольких местах. Пожалуйста, посмотрите примеры в папке `src/includes/`.

Необходимо отличать простые компоненты от макро-компонентов, которые могут принимать параметры.

Так называемые инклуды или простые компоненты рекомендуется хранить в папке `src/includes/`. Такие части в дальнейшем можно добавлять на страницы и в шаблоны с помощью `{% include '../includes/some-component/some-component.nunj' %}`. 

Компоненты которые могут принимать параметры рекомендуется хранить в папке `src/components/`.
Пример макро-компонента `icon`:

```
{% macro icon(props) %}
	<svg {% if props.className %}class="{{ props.className }}"{% endif %}{% if props.attr %} {{ props.attr }}{% endif %}>
		<use xlink:href="#icon-{{ props.iconName }}" />
	</svg>
{% endmacro %}
```
Такой компонент можно импортировать и использовать в нескольких местах:

```
{% from "../../components/icon/icon.nunj" import icon %}

{{ icon({
	iconName: 'chat',
	className: 'icon',
	attr: 'viewBox="0 0 20 20" style="width: 40px; height: 40px; fill: #212121;"'
}) }}
```

 Кроме того, необязательно включать код Nunjucks или JS для компонента, если вы чувствуете, что в этом нет особого смысла. Например, когда разметка довольно простая или когда в компоненте нет логики JS.

## HTML-шаблонизатор Nunjucks

[Nunjucks](https://mozilla.github.io/nunjucks/) - мощный шаблонизатор с синтаксисом а-ля jinja2, который позволяет создавать качественный, легкоподдерживаемый HTML-код.

Nunjucks-шаблоны находятся в `src/templates/`.

Данные, которые могут быть использованы в нескольких местах, следует складывать в файл `global-data.json`, который находится в корне проекта. После этого к ним можно обращаться в шаблонах:

```
<p>Some title: {{ someData[0].title }}</p>
```

Шаблоны страниц, которые должны быть скомпилированы в папку `build/`, кладём в папку `src/pages/`

Кастомные фильтры, макросы и функции складываем в соответствующих файлах в `src/templates/lib/`.

Для эффективного применения шаблонизатора см. примеры в стартовом проекте, а также [документацию](https://mozilla.github.io/nunjucks/templating.html).

Для настройки синтаксиса в редакторах (Sublime, Webstorm) скачиваем плагин для шаблонизатора Twig и настраиваем открытие файлов с расширением .nunj с подстветкой Twig по умолчанию.

## Webpack Hot Module Replacement

В SP.Starter настроен [Webpack HMR](https://webpack.js.org/concepts/hot-module-replacement/). По умолчанию при изменении в JS файле происходит замена этого модуля и всех его зависимостей.

<b>Важно!</b> Для корректной работы необходимо правильно обрабатывать side-эффекты, которые генерирует ваш код.

Например, если есть код, добавляющий обработчик на событие клика:

`document.body.addEventListener('click', this.someMethod);`

То прямо в коде необходимо добавить следующую инструкцию для Webpack:

```
// Удаляем обработчик события, чтобы после повторного исполнения предыдущего кода этот обработчик не был добавлен повторно.
if (module.hot) {
	module.hot.dispose(() => {
		document.body.removeEventListener('click', this.someMethod);
	});
}
```

В противном случае, обработчик на клик будет добавляться при каждом обновлении, генерируемом с помощью HMR.

Таким же образом надо поступать и с изменением DOM-дерева:

```
var sideEffectNode = document.createElement("div");
sideEffectNode.textContent = "Side Effect";
document.body.appendChild(sideEffectNode);
```

Добавляем:

```
// Удаляем <div>, добавленный в DOM, чтобы после исполнения предыдущего кода этот <div> не был добавлен повторно.
if (module.hot) {
  module.hot.dispose(function() {
    sideEffectNode.parentNode.removeChild(sideEffectNode);
  });
}
```

## Структура SCSS-файлов

В Стартере существует следующая структура SCSS-файлов:

```
/styles/
	/lib/				// Библиотеки и миксины
	/pages/				// Стили для страниц проекта
		_main.scss		// Стили для главной страницы
	_constants.scss		// Переменные и константы
	_controls.scss		// Стили для контролов
	_fonts.scss			// Подключаемые шрифты
	_global.scss		// Стили глобальных блоков
	_layout.scss		// Стили лэйаута
	_reset.scss			// CSS-reset и обнуление стилей
	styles.scss			// Основной файл, который компилируется в styles.css
```

Для каждой страницы создается отдельный файл в папке `pages`. Для каждого компонента создается отдельный файл в папке `src/components/<components_name>`.

Все подключаемые файлы должны начинаться с одного подчеркивания (`_`).

## SVG-спрайты

В стартовом проекте настроена возможность создания SVG-спрайтов с помощью [gulp-svgstore](https://github.com/w0rm/gulp-svgstore), поэтому SVG на сайт лучше добавлять, используя компонент `icon`, следующим способом:

```
{{ icon({
    iconName: 'some-vector-image',
    className: 'icon',
    attributes: 'viewBox="0 0 20 20"'
}) }}
```

Свойства `className` и `attributes` указывать необязательно. SVG-файл `some-vector-image.svg` должен находиться в папке `src/assets/svg/`. Такому элементу необходимо задать width и height в стилях. Ему также можно менять fill, stroke при условии, что в исходном файле `some-vector-image.svg` у элемента не заданы такие же атрибуты (fill и stroke).

**Обратите внимание на то, что при подключении svg-спрайта в компоненте `icon` используется `#icon-` префикс в пути до спрайта: `#icon-some-vector-image` (фактически будет использован `some-vector-image.svg`).**

## Растровые спрайты

Для создания простого спрайта из изображений нужно использовать миксин

```
+s(name)
```

Следующий миксин для спрайта под ретину. Для него необходимо использовать 2 изображения: простое и в 2 раза больше. Например: `sp.png` и `sp@2x.png`.

```
+sr(name)
```

Изображения, которые собираются в спрайт, должны быть в формате `.png` и находится в директории `assets/images/sprites/`.

## Инлайн картинок или SVG

Инлайн картинок или SVG можно использовать для мелких иконок на странице, но не для всей графики. Стоит помнить, что при инлайне размер файла графики увеличивается, т.к. он конвертируется в base64.

<b>Внимание!</b> Изображения, которые будут инлайниться, должны находится в директории `src/assets/images/inline`.

### В SCSS

Плагин postcss-assets позволяет инлайнить изображения прямо в код в Base64 кодировке (или в виде кода в случае с SVG):

```
background: inline('sp.png')
```

Так же позволяет подставить размеры картинки:

```
width: width('sp.png')
```

```
height: height('sp.png')
```

```
background-size: size('sp.png')
```

### В Nunjucks-шаблонах

```
<img src={% inline 'image.png' %} alt="Some image" />
```

## Полезные ссылки

[Синтаксис Nunjucks](https://mozilla.github.io/nunjucks/templating.html).

[Сборка фронтенд-проекта с помощью Gulp](http://habrahabr.ru/post/250569/).

[Адаптивная сетка Twitter Bootstrap](http://getbootstrap.com/css/#grid).
