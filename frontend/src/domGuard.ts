/*
 * Védelem a böngészős fordítók (Chrome/Google Fordító, Edge) és bővítmények ellen:
 * ezek átírják a DOM-ot a React tudta nélkül, és a következő oldalváltáskor a React
 * "removeChild / insertBefore: not a child of this node" hibával az egész oldalt
 * eltünteti (fekete képernyő). Ilyenkor a műveletet csendben kihagyjuk.
 * Forrás: https://github.com/facebook/react/issues/11538
 */
if (typeof Node === 'function' && Node.prototype) {
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };

  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return insertBefore.call(this, node, null) as T;
    return insertBefore.call(this, node, ref) as T;
  };
}

export {};
