# Glite Python style guide

Treat this style guide as a living document explaining emergent conventions and the reasoning behind them.

- [Main principles](#main-principles)
- [General](#general)
- [Type hinting](#type-hinting)
  - [Satisfy mypy and use explicit types as assertions](#satisfy-mypy-and-use-explicit-types-as-assertions)
  - [Use exhaustive matches where applicable](#use-exhaustive-matches-where-applicable)
  - [Use `int | None` instead of `Optional[int]`](#use-int--none-instead-of-optionalint)
  - [Use the type system to encode and validate business logic constraints](#use-the-type-system-to-encode-and-validate-business-logic-constraints)
  - [Use `T_Whatever` format for meaningful type variables](#use-t_whatever-format-for-meaningful-type-variables)
- [Asserts](#asserts)
  - [Use `assert` for defensive coding and documentation](#use-assert-for-defensive-coding-and-documentation)
  - [Assume that `assert`s are always run](#assume-that-asserts-are-always-run)
  - [Use positive assertion messages](#use-positive-assertion-messages)
- [Imports](#imports)
  - [Use direct imports (with exceptions documented below)](#use-direct-imports-with-exceptions-documented-below)
  - [Use absolute imports](#use-absolute-imports)
- [Dataclasses/pydantic](#dataclassespydantic)
  - [Use `dataclass` by default when values need to be grouped together](#use-dataclass-by-default-when-values-need-to-be-grouped-together)
  - [Make `dataclass` frozen and slotted by default](#make-dataclass-frozen-and-slotted-by-default)
  - [Use `pydantic` only where validation or serialisation is required](#use-pydantic-only-where-validation-or-serialisation-is-required)
- [Django](#django)
  - [Add `created_at`/`changed_at` meta-fields to models unless there are reasons not to](#add-created_atchanged_at-meta-fields-to-models-unless-there-are-reasons-not-to)
- [Links](#links)



## Main principles:

* If something can be automated out of the style guide and human attention, it should be. Therefore, if a convention
can be enforced with `ruff`, it doesn't belong here.
* The style we're after is concise, pragmatic, semantic-rich, and readable. It's alright to have a learning
curve for new colleagues if it's beneficial in the long run.
* There is no need for grand migrations whenever the style guide changes or new guidance is introduced. Ship
new code in the new style and do best effort adaptation of the old code, but don't delay new guidance until
legacy code can be reworked.
* Strive for robustness and early loud failures.
* This is guidance, not hard-and-fast rules. The guidance can be ignored when required.



## General

### Use the most recent Python syntax and libraries (as long as they are supported by our tooling)

#### Why:

* Stay ahead of deprecation warnings
* New syntax is generally cleaner

#### Do:

* `list[int]`
* `from collections.abc import Iterable`
* [PEP695](https://peps.python.org/pep-0695/) style generics (`def func[T](a: T) -> T`)
* `Path("foo") / "bar"`

#### Don't:

* `List[int]`
* `from typing import Iterable`
* old-style generics (`T = TypeVar("T"); def func(a: T) -> T`)
* `os.path.join("foo", "bar")`




### Use `@property` only for simple operations

Never put non-trivial computation or IO inside a `@property`.

#### Why:

It's impossible to distinguish an innocent field access or a heavy/IO `@property` access on the call site,
which easily becomes a problem whenever the access is looped or requires tight timing (e.g. whilst
holding a database lock).

#### Do:

```python
class MyClass:
    a: int

    @property
    def aplusone(self):
        return self.a + 1

    def get_db_data(self):
        return fetch_b_from_db(self.a)
```

#### Don't:

```python
class MyClass:
    a: int

    @property
    def aplusone(self):
        return self.a + 1

    @property
    def db_data(self):
        return fetch_b_from_db(self.a)
```


### Use explicit checks instead of relying on values being falsey

Don't use the idiomatic falsiness of empty lists, zeroes, empty strings, and `None`s,
check them explicitly.

#### Why:

This idiom is too error-prone, especially in presence of `T | None` types.

#### Do:

```python
if x is None:
    ...
```

```python
if len(x) == 0:
    ...
```

```python
if (x := get_x()) is not None:
    ...
```

#### Don't:

Assuming non-`bool` x:

```python
if x:
    ...
```

```python
if x := get_x():
    ...
```


### Put more general, "context-y" function parameters first when defining functions

A useful rule of thumb is "would it be convenient to use `partial()` on this function".

#### Why:

Consistency, extra semantic information, and convenience of `partial()`.

#### Do:

```python
def foo(context, db, ids_to_fetch):
    ...
```

#### Don't:

```python
def foo(ids_to_fetch, context, db):
    ...
```


### Use keyword argument syntax when calling functions that have two or more heterogeneous parameters

#### Why:

Keyword arguments are more resilient to refactorings and typos and are easier to read.

#### Do:

```python
foo(
    db=db,
    user=current_user,
    is_registered=True,
)
```

Assuming that `obj1`, `obj2`, and `obj3` are homogenous (i.e. one type):

```python
foo(ctx, obj1, obj2, obj3)
```

#### Don't:

```python
foo(db, current_user, True)
```


### Write and store all durations in fractional seconds (floats)

#### Why:

Primarily, consistency. We don't normally need to be more precise than milliseconds, and milliseconds
can be perfectly expressed as fractional seconds using a floating point number.


#### Do:

```python
QUERY_TIMEOUT: float = 5.000  # milliseconds as a float
```

#### Don't:

```python
QUERY_TIMEOUT: int = 5000  # milliseconds not as a float
```


### Use "kind" instead of "type" in names

#### Why:

`type` clashes with built-in `type` too much.

#### Do:

```python
class UserKind(Enum):
    ...
```

#### Don't:

```python
class UserType(Enum):
    ...
```



## Type hinting

### Satisfy mypy and use explicit types as assertions

Prefer type inference and use explicit type annotations in three cases:

* wherever the types are required by `mypy` (function signatures, tricky inference, etc.)
* as assertions that the inferred type is what you think it is
* as documentation

#### Why

Relying on type inference makes things more concise, but sometimes the inferred type might not match
the intuition and even mask an error. Consider this example:

```python
a = foo()
b = foo()

print(str(a + b))
```

What's `a` and `b`? Imagine that when you wrote the code `foo` returned `int`, but then started returning `str`.
The snippet above will still typecheck, but output a completely unexpected value.

However, in most cases, something downstream will fail to type check, so use your judgment to decide if an explicit
type (effectively, an assertion that the type is inferred correctly) is worth it.

#### Do:

(when it makes sense)

```python
a: int = foo()
b = foo()
print(str(a + b))
```

#### Don't:

```python
def myfun() -> ...:
    a: int = 1
    b: int = 2
```


### Use exhaustive matches where applicable

Use `assert_never` to make mypy scream at you for forgetting to handle a branch or an element of a type union.

#### Why:

Types and code change over time. Whenever you have code like this

```python
X: TypeAlias = Foo | Bar

def f(x: X) -> None:
    if isinstance(x, Foo):
        ...
    else:
        ...
```

…it might subtly break when X becomes `Foo | Bar | Baz`. Instead, if you use

```python
X: TypeAlias = Foo | Bar

def f(x: X) -> None:
    if isinstance(x, Foo):
        ...
    elif isinstance(x, Bar):
        ...
    else:
        assert_never(x)
```

…mypy will complain that not every case is covered in the explicit branches above. You will know that
the code needs fixing before you even run the tests.

You can also use `assert_never` for unreachable code, e.g. when you have a number of early returns
that should always return a value first.

[More on exhaustiveness checking in the docs](https://typing.readthedocs.io/en/latest/guides/unreachable.html)


### Use `int | None` instead of `Optional[int]`

#### Why

No one knows why, but it's consistent.

#### Do

```python
a: int | None
```

### Don't

```python
a: Optional[int]
```


### Use the type system to encode and validate business logic constraints

Try to model business constraints in the type system, as long as it's practical.

Links for inspiration: [making illegal states unrepresentable](https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/),
[typestate pattern](https://cliffle.com/blog/rust-typestate/)

#### Why:

The earlier we find mistakes, the less costly they are. Using the type system lets us find errors
even before we start writing tests.

#### Do:

```python
@dataclass(frozen=True, slots=True)
class AnonymousUser:
    id: int


@dataclass(frozen=True, slots=True)
class AuthenticatedUser:
    id: int
    name: str
    email: str


class process(user: AnonymousUser | AuthenticatedUser) -> None:
    ...
```

#### Don't:

```python
@dataclass(frozen=True, slots=True)
class User:
    id: int
    name: str | None
    email: str | None


class process(user: User) -> None:
    ...
```


### Use `T_Whatever` format for meaningful type variables

Sometimes you need type variables that aren't just `T`.

#### Why:

You've got to pick one format and stick with it.

#### Do:

`T_User`

#### Don't:

* `UserT`
* `User`
* `UserType`



## Asserts

### Use `assert` for defensive coding and documentation

Whenever you assume something to be true, assert it explicitly with an `assert`.

#### Why:

`assert` serves two purposes:

* surfacing broken assumptions early and explicitly
* documenting the assumptions you're making

#### Do:

```python
def trim_nonempty_list(lst: list[T], n: int) -> list[T]:
    assert len(list) > 0
    assert 0 <= n <= len(list)

    return lst[:n]
```

#### Don't:

```python
def trim_nonempty_list(lst: list[T], n: int) -> list[T]:
    return lst[:n]
```


### Assume that `assert`s are always run

We never run Python with the `-O` flag, so `assert` can be assumed to always run.
Plan expensive checks accordingly.

#### Why:

Python assertions were initially modelled after C, where assertions are compiled out during optimised
compilation. Today this doesn't match the way Python is used in practice.

Many Python libraries use asserts to assert things that must always be true, including safety-critical conditions
(e.g. [Django](https://github.com/django/django/blob/db5980ddd1e739b7348662b07c9d91478d911877/django/contrib/auth/hashers.py#L333)).
There is little performance benefit to disabling those assertions. On the other hand, being able to assert things
to be true is good and our style should encourage this, making assertions as concise and explicit as possible.


### Use positive assertion messages

#### Why:

Positive assertion messages make the intent clearer. It is also acceptable to use a message explicitly explains
what was expected and what was received, such as `assert isinstance(dog, Cat), "Expected type Cat, got Dog"`.

#### Do:

`assert a.is_foobar(), "a is foobar"`

#### Don't:

* `assert a.is_foobar(), "Foobar error"`
* `assert a.is_foobar(), "a is not foobar"`



## Imports

### Use direct imports (with exceptions documented below)

Prefer direct imports (`from lib import f; f()`, not `import lib; lib.f()`), except when
it's too annoying or when using one of the libraries documented below.

Exceptions:

* `import pandas as pd`
* `import numpy as np`
* `import polars as pl`

#### Why:

When you use direct imports, a missing module member will throw an error during the import.
If you refer to the module instead, the error will be thrown when the module member is accessed,
potentially much later.

#### Do:

```python
from lib.datapuddle import prepare

prepare(...)
```

```python
from lib.datapuddle import prepare as datapuddle_prepare

datapuddle_prepare(...)
```

#### Don't:

```python
from lib import datapuddle

datapuddle.prepare(...)
```


### Use absolute imports

#### Why:

1. Deep relative imports (like `from ...bar import f`) are confusing
2. Some tooling doesn't work well when we mix relative and absolute imports

Therefore, we pick one style (absolute imports) and use it throughout.

This is faciliated by the root of the monorepo being in `$PYTHONPATH`.

#### Do:

```python
from data.foo.bar import f
```

#### Don't:

```python
from .bar import f
```



## Dataclasses/pydantic

### Use `dataclass` by default when values need to be grouped together

#### Why:

Slotted `dataclass`es have almost no runtime overhead, make code more readable, and
make typing more explicit.

#### Do:

```python
@dataclass(frozen=True, slots=True)
class Point:
    x: int
    y: int

POINTS: list[Point] = [Point(0, 1), Point(1, 2)]
```

```python
@dataclass(frozen=True, slots=True)
class Result:
    first: str
    second: str
    is_recognised: bool

def foo() -> Result:
    ...
    return Result(a, b, True)
```

#### Don't:

```python
POINTS: list[Point] = [(0, 1), (1, 2)]
```

```python
def foo() -> Result:
    ...
    return a, b, True
```


### Make `dataclass` frozen and slotted by default

#### Why:

`frozen` makes dataclass fields immutable, which reduces the chances of accidental mutations. Note
that nested datastructures can still be mutated, so `frozen_dataclass.a_list.append(...)` works.

`slots` [makes the class store the fields directly](https://docs.python.org/3/reference/datamodel.html#object.__slots__)
instead of going through a hashmap, which greatly reduces memory and CPU overhead of dataclasses.
Slotted dataclasses are very close to simple tuples in terms of performance.

#### Do:

```python
@dataclass(frozen=True, slots=True)
class Foo:
    ...
```

#### Don't:

```python
@dataclass
class Foo:
    ...
```


### Use `pydantic` only where validation or serialisation is required

#### Why:

Pydantic has substantially more overhead, API surface, and gotchas than raw `dataclass`es,
so we prefer `dataclass` by default and only use `pydantic` on the "edge" of the system.


## Django

### Add `created_at`/`changed_at` meta-fields to models unless there are reasons not to

#### Why:

There is little cost to an extra pair of datetime fields, and they are useful for
debugging and fixing data when sometimes goes wrong.


### Use `null=True` and non-empty constraints for `CharField`s where it makes sense

#### Why:

There is a semantic difference between a missing string (`None`) and an empty string (`""`).
The former means "no information", "unknown", or "inapplicable", while the latter means "there is a value,
but it is empty". This semantic difference surfaces on fields that have `unique=True`:
`None`/`NULL` values are ignored for uniqueness checks, while empty strings are not. There can
only be one empty string value in a unique column, but an unlimited number of `None` values.


## Links

* [Rejected and retired guidelines](rejected_retired.md)
